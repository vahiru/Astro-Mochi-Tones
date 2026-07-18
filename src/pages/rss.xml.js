import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import themeConfig from "astro-mochi-tones:config";
import { renderPortableMarkdown } from "../utils/content-output";

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const SAFE_IMAGE_PROTOCOLS = new Set(["https:"]);

const getPostSlug = (post) =>
  "slug" in post && typeof post.slug === "string"
    ? post.slug
    : post.id.replace(/\.(md|mdx)$/i, "");

const getPostUrl = (post, site) => {
  const segments = getPostSlug(post)
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .map((segment) => encodeURIComponent(segment));
  return new URL(`/blog/${segments.join("/")}/`, site);
};

const toSafeAbsoluteUrl = (value, baseUrl, allowedProtocols) => {
  if (typeof value !== "string" || /[\u0000-\u001f\u007f]/.test(value)) return undefined;

  try {
    const url = new URL(value.trim(), baseUrl);
    return allowedProtocols.has(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};

const safeDimension = (value) => {
  if (!/^\d{1,4}$/.test(value ?? "")) return undefined;
  const dimension = Number(value);
  return dimension >= 1 && dimension <= 4096 ? String(dimension) : undefined;
};

const sanitizeFeedContent = (source, postUrl) =>
  sanitizeHtml(renderPortableMarkdown(source), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
      img: ["https"],
    },
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    transformTags: {
      a: (_tagName, attributes) => {
        const href = toSafeAbsoluteUrl(attributes.href, postUrl, SAFE_LINK_PROTOCOLS);
        return {
          tagName: "a",
          attribs: {
            ...(href ? { href } : {}),
            ...(attributes.title ? { title: attributes.title } : {}),
          },
        };
      },
      img: (_tagName, attributes) => {
        const src = toSafeAbsoluteUrl(attributes.src, postUrl, SAFE_IMAGE_PROTOCOLS);
        const width = safeDimension(attributes.width);
        const height = safeDimension(attributes.height);
        return {
          tagName: "img",
          attribs: {
            ...(src ? { src } : {}),
            ...(attributes.alt ? { alt: attributes.alt } : { alt: "" }),
            ...(attributes.title ? { title: attributes.title } : {}),
            ...(width ? { width } : {}),
            ...(height ? { height } : {}),
          },
        };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET(context) {
  if (!context.site) {
    throw new Error("RSS generation requires Astro's site option to be configured");
  }

  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((left, right) => right.data.date.valueOf() - left.data.date.valueOf());

  return rss({
    title: themeConfig.title,
    description: themeConfig.description ?? "",
    site: context.site,
    items: posts.map((post) => {
      const postUrl = getPostUrl(post, context.site);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: postUrl.href,
        content: sanitizeFeedContent(post.body ?? "", postUrl),
      };
    }),
    customData: `<language>${escapeXml(themeConfig.lang)}</language>`,
  });
}
