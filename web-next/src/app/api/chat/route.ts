import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { rehbarTools } from "@/lib/chat/tools";
import { offlineRehbarReply } from "@/lib/chat/offline-reply";

export const maxDuration = 60;

/** Only call the LLM when an explicit key is set.
 *  Do not treat `VERCEL=1` as enough — AI Gateway can 403 without billing,
 *  and those stream errors surface as client "Something went wrong".
 */
function hasAiCredentials() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
  );
}

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "user") continue;
    const parts = msg.parts ?? [];
    const text = parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
}

function offlineStreamResponse(text: string) {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = `text_${Date.now()}`;
      writer.write({ type: "text-start", id });
      const chunkSize = 64;
      for (let i = 0; i < text.length; i += chunkSize) {
        writer.write({
          type: "text-delta",
          id,
          delta: text.slice(i, i + chunkSize),
        });
      }
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: { "x-rehbar-mode": "offline" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = (body.messages ?? []) as UIMessage[];
  const userText = lastUserText(messages) || "hello";

  if (!hasAiCredentials()) {
    return offlineStreamResponse(offlineRehbarReply(userText));
  }

  try {
    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages),
      tools: rehbarTools,
      stopWhen: stepCountIs(6),
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse({
      headers: { "x-rehbar-mode": "ai" },
      onError: (err) => {
        console.error("[rehbar/chat] stream", err);
        return offlineRehbarReply(userText);
      },
    });
  } catch (err) {
    console.error("[rehbar/chat]", err);
    return offlineStreamResponse(offlineRehbarReply(userText));
  }
}
