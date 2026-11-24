import { redirect } from "next/navigation";

/** Live site uses /location/{region}/featured — same content as region page. */
export default async function RegionFeaturedRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/where-to-go/location/${slug}`);
}
