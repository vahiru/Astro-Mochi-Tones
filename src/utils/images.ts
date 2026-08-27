import type { ImageMetadata } from "astro";
import { sanitizeAssetUrl } from "./security";

/**
 * 站点自己的图片资源。放在 src/assets/images/ 下的图片会经过 astro:assets
 * 处理（按需生成多种尺寸和格式）；放在 public/images/ 下的会被原样发布。
 *
 * glob 模式以 / 开头，Vite 会相对项目根目录解析，因此主题能读到使用方项目的资源。
 *
 * 这里刻意不用 `eager: true`：那会把目录下每张图都拉进模块图，导致连从未被引用的
 * 图片也被输出到 dist（图多了以后构建也会变慢）。懒加载只在真正用到时才 import。
 */
const localImages = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/images/**/*.{jpeg,jpg,png,webp,avif,gif}",
);

/**
 * 把 frontmatter / 组件里写的字符串路径解析成可优化的图片资源。
 *
 * 返回 ImageMetadata 表示命中了 src/assets/images/ 下的文件，调用方应交给
 * astro:assets 的 <Image> 渲染；返回字符串表示这是 public/ 里的文件或外链，
 * 只能原样输出 <img>。这样 `/images/foo.jpg` 这类写法在两种存放方式下都能用，
 * 把图片从 public/images/ 挪到 src/assets/images/ 即可获得优化，无需改文章。
 */
export async function resolveImage(
    source?: string,
): Promise<ImageMetadata | string | undefined> {
    if (!source) return undefined;

    const safe = sanitizeAssetUrl(source);
    if (!safe) return undefined;

    // 外链无法本地优化。
    if (/^https?:\/\//i.test(safe)) return safe;

    const path = safe.split(/[?#]/)[0];
    const candidates = path.startsWith("/images/")
        ? [`/src/assets${path}`, `/src/assets/images${path.slice("/images".length)}`]
        : [`/src/assets/images${path.startsWith("/") ? path : `/${path}`}`];

    for (const candidate of candidates) {
        const load = localImages[candidate];
        if (load) return (await load()).default;
    }

    return safe;
}

/** 供模板区分两种分支。 */
export function isLocalAsset(
    value: ImageMetadata | string | undefined,
): value is ImageMetadata {
    return typeof value === "object" && value !== null && "src" in value;
}
