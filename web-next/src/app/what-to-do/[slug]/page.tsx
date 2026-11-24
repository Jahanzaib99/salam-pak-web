import { redirect } from "next/navigation";

/** Legacy `/what-to-do/{slug}` → live route `/what-to-do/activity/{slug}`. */
export default async function LegacyWhatToDoRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/what-to-do/activity/${slug}`);
}
