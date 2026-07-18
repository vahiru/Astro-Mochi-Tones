import { getCollection, type CollectionEntry } from "astro:content";
import { markdownToPlainText } from "../utils/content-output";

const MAX_CONTENT_CHARACTERS = 5000;

const getPostSlug = (post: CollectionEntry<"blog">) =>
  "slug" in post && typeof post.slug === "string"
    ? post.slug
    : post.id.replace(/\.(md|mdx)$/i, "");

const getPostPath = (post: CollectionEntry<"blog">) => {
  const segments = getPostSlug(post)
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .map((segment) => encodeURIComponent(segment));
  return `/blog/${segments.join("/")}`;
};

export async function GET() {
  const searchIndex = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((left, right) => right.data.date.valueOf() - left.data.date.valueOf())
    .map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      content: markdownToPlainText(post.body, MAX_CONTENT_CHARACTERS),
      slug: getPostPath(post),
      date: post.data.date.toISOString(),
      tags: post.data.tags ?? [],
      categories: post.data.categories ?? [],
    }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
