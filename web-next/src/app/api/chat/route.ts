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

function hasAiCredentials() {
  // Local: needs AI_GATEWAY_API_KEY (or OPENAI_API_KEY).
  // On Vercel: AI Gateway can authenticate via OIDC without a manual key.
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.VERCEL
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
      writer.write({ type: "text-delta", id, delta: text });
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
  const userText = lastUserText(messages);

  if (!hasAiCredentials()) {
    return offlineStreamResponse(offlineRehbarReply(userText || "hello"));
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
      headers: {
        "x-rehbar-mode": "ai",
      },
    });
  } catch (err) {
    console.error("[rehbar/chat]", err);
    return offlineStreamResponse(
      offlineRehbarReply(userText || "hello") +
        "\n\n_(AI gateway briefly unavailable — answered from the local Salam Pakistan knowledge base.)_"
    );
  }
}
