import type { AstroIntegration } from "astro";
import { z } from "astro/zod";
import { fileURLToPath } from "node:url";
import { isAbsolute, relative, resolve } from "node:path";

const safeHrefSchema = z.string().min(1).refine((value) => {
    if (value.startsWith("#")) return true;
    if (value.startsWith("/")) return !value.startsWith("//");

    try {
        return ["https:", "http:", "mailto:"].includes(new URL(value).protocol);
    } catch {
        return false;
    }
}, "Links must use a site-relative, http(s), mailto, or hash URL");

const httpsUrlSchema = z.url().refine(
    (value) => new URL(value).protocol === "https:",
    "Remote resources must use HTTPS",
);

const safeResourceSchema = z.string().min(1).max(2048).refine((value) => {
    if (value.startsWith("/")) return !value.startsWith("//");

    try {
        return new URL(value).protocol === "https:";
    } catch {
        return false;
    }
}, "Resources must use a site-relative path or an HTTPS URL");

const sitePathSchema = z.string().regex(
    /^\/(?!\/)[^\s]*$/,
    "Generated endpoints must use a site-relative path",
);

const hexColorSchema = z.string().regex(
    /^#[0-9a-f]{6}$/i,
    "Colors must use six-digit hexadecimal notation",
);

const navItemSchema = z.object({
    label: z.string().min(1).max(40),
    icon: z.string().regex(/^[a-z0-9_]+$/i).max(64),
    href: safeHrefSchema,
    activePattern: z.string().max(256).optional(),
});

const footerLinkSchema = z.object({
    label: z.string().min(1).max(80),
    href: safeHrefSchema,
    external: z.boolean().optional(),
});

const configSchema = z.object({
        title: z.string(),
        description: z.string().optional(),
        author: z.string().optional(),
        lang: z.string().default("zh-CN"),
        locale: z.string().default("zh_CN"),
        favicon: safeResourceSchema.default("/favicon.svg"),
        defaultImage: safeResourceSchema.default("/images/default-og.png"),
        rssPath: sitePathSchema.default("/rss.xml"),
        searchPath: sitePathSchema.default("/search.json"),
        fonts: z
            .array(
                z.object({
                    href: httpsUrlSchema,
                    rel: z.enum(["stylesheet", "preconnect", "preload"]).default("stylesheet"),
                    crossorigin: z.boolean().optional(),
                }),
            )
            .default([
                {
                    href: "https://fonts.googleapis.com",
                    rel: "preconnect",
                },
                {
                    href: "https://fonts.gstatic.com",
                    rel: "preconnect",
                    crossorigin: true,
                },
                {
                    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
                    rel: "stylesheet",
                },
                {
                    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
                    rel: "stylesheet",
                },
            ]),
        nav: z
            .object({
                drawerTitle: z.string().default("Menu"),
                items: z.array(navItemSchema).default([
                    { label: "Home", icon: "home", href: "/" },
                    {
                        label: "Blog",
                        icon: "inventory_2",
                        href: "/archives",
                        activePattern: "^/archives",
                    },
                    {
                        label: "About",
                        icon: "face",
                        href: "/about",
                        activePattern: "^/about",
                    },
                    {
                        label: "Friends",
                        icon: "group",
                        href: "/friends",
                        activePattern: "^/friends",
                    },
                ]),
                rssLabel: z.string().default("RSS"),
                rssIcon: z.string().default("rss_feed"),
                colorLabel: z.string().default("Color"),
                colorIcon: z.string().default("palette"),
                themeLabel: z.string().default("Theme"),
                darkIcon: z.string().default("dark_mode"),
                lightIcon: z.string().default("light_mode"),
            })
            .prefault({}),
        footer: z
            .object({
                slogan: z.string().optional(),
                socialTitle: z.string().default("Social"),
                links: z.array(footerLinkSchema).default([]),
                copyrightTemplate: z
                    .string()
                    .default("© {year} {author}. All rights reserved."),
                themeCreditLabel: z.string().default("Theme"),
                themeCreditText: z.string().default("Mochi Tones"),
                themeCreditHref: safeHrefSchema
                    .default("https://github.com/vahiru/Astro-Mochi-Tones"),
                showThemeCredit: z.boolean().default(true),
            })
            .prefault({}),
        labels: z
            .object({
                menu: z.string().default("Menu"),
                search: z.string().default("Search"),
                searchPlaceholder: z.string().default("Search..."),
                searchEmpty: z.string().default("Type to search..."),
                searchNoResults: z.string().default("No results found."),
                untitled: z.string().default("Untitled"),
                noDate: z.string().default("No date"),
                backHome: z.string().default("Back home"),
                previousPost: z.string().default("Previous"),
                nextPost: z.string().default("Next"),
                tocTitle: z.string().default("On this page"),
                noHeadings: z.string().default("No headings"),
                customizeTheme: z.string().default("Customize Theme"),
                presetColors: z.string().default("Preset Colors"),
                customColor: z.string().default("Custom Color"),
                pickColor: z.string().default("Pick a color"),
                close: z.string().default("Close"),
                tagTitlePrefix: z.string().default("Tag: "),
                categoryTitlePrefix: z.string().default("Category: "),
                postsCountTemplate: z.string().default("{count} posts"),
                archiveTitleTemplate: z.string().default("Archives - Page {page}"),
                archiveHeading: z.string().default("Archives"),
                archiveEyebrow: z.string().default("Library · Archive"),
                archiveDescription: z
                    .string()
                    .default("Browse every published story by year and category."),
                archiveTimelineTitle: z.string().default("Timeline"),
                archiveTimelineDescription: z
                    .string()
                    .default("Stories are ordered from newest to oldest."),
                archiveBrowseDescription: z
                    .string()
                    .default("Choose a category to explore related stories."),
                categoriesTitle: z.string().default("Categories"),
                noCategories: z.string().default("No categories"),
                postsLabel: z.string().default("Posts"),
                yearsLabel: z.string().default("Years"),
                categoryEyebrow: z.string().default("Category"),
                tagEyebrow: z.string().default("Tag"),
                taxonomyDescriptionTemplate: z
                    .string()
                    .default("Explore every post filed under {name}."),
                backToArchives: z.string().default("All archives"),
                paginationLabel: z.string().default("Pagination"),
                paginationPrevious: z.string().default("Previous"),
                paginationNext: z.string().default("Next"),
                pageInfoTemplate: z.string().default("Page {current} of {total}"),
            })
            .prefault({}),
        colorPicker: z
            .object({
                    defaultColor: hexColorSchema.default("#6750a4"),
                    presetColors: z
                    .array(hexColorSchema)
                    .default([
                        "#6750a4",
                        "#9c4146",
                        "#006a6a",
                        "#5d5f00",
                        "#006e1c",
                    ]),
            })
            .prefault({}),
        waline: z
            .object({
                serverURL: httpsUrlSchema.optional(),
                emojis: z
                    .array(httpsUrlSchema)
                    .default([]),
                pageview: z.boolean().default(true),
                comment: z.boolean().default(true),
                dark: z.string().default("html.dark"),
            })
            .optional(),
});

const themeRoot = fileURLToPath(new URL(".", import.meta.url));
const sourceRoot = resolve(themeRoot, "src");
const virtualConfigId = "\0astro-mochi-tones:config";

const moduleRoots = {
    components: resolve(sourceRoot, "components"),
    layouts: resolve(sourceRoot, "layouts"),
    styles: resolve(sourceRoot, "styles"),
} as const;

const themeRoutes = {
    "/archives/[...page]": "src/pages/archives/[...page].astro",
    "/blog/[...slug]": "src/pages/blog/[...slug].astro",
    "/categories/[category]/[...page]": "src/pages/categories/[category]/[...page].astro",
    "/tags/[tag]/[...page]": "src/pages/tags/[tag]/[...page].astro",
    "/rss.xml": "src/pages/rss.xml.js",
    "/search.json": "src/pages/search.json.ts",
} as const;

export type MochiTonesConfig = z.infer<typeof configSchema>;
type ThemeRoute = keyof typeof themeRoutes;

export interface MochiTonesOptions {
    config: z.input<typeof configSchema>;
    pages?: Partial<Record<ThemeRoute, boolean | string>>;
    overrides?: Record<string, never>;
}

function hasMatchingParams(original: string, replacement: string) {
    const extract = (pattern: string) => pattern.match(/\[[^\]]+\]/g) ?? [];
    return JSON.stringify(extract(original)) === JSON.stringify(extract(replacement));
}

export default function MochiTones(options: MochiTonesOptions): AstroIntegration {
    const config = configSchema.parse(options.config);

    return {
        name: "astro-mochi-tones",
        hooks: {
            "astro:config:setup": ({ addWatchFile, injectRoute, logger, updateConfig }) => {
                addWatchFile(new URL("./src/", import.meta.url));

                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: "astro-mochi-tones:virtual-modules",
                                enforce: "pre",
                                resolveId(source) {
                                    if (source === "astro-mochi-tones:config") {
                                        return virtualConfigId;
                                    }

                                    const match = /^astro-mochi-tones:(components|layouts|styles)\/(.+)$/.exec(source);
                                    if (!match) return null;

                                    const moduleType = match[1] as keyof typeof moduleRoots;
                                    const base = moduleRoots[moduleType];
                                    const resolved = resolve(base, match[2]);
                                    const relativePath = relative(base, resolved);

                                    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
                                        throw new Error(`Invalid astro-mochi-tones import: ${source}`);
                                    }

                                    return resolved;
                                },
                                load(id) {
                                    if (id !== virtualConfigId) return null;
                                    return `export default ${JSON.stringify(config)};`;
                                },
                            },
                        ],
                    },
                });

                for (const [pattern, entrypoint] of Object.entries(themeRoutes)) {
                    const pageOption = options.pages?.[pattern as ThemeRoute];
                    if (pageOption === false) continue;

                    const finalPattern = typeof pageOption === "string" ? pageOption : pattern;
                    if (!hasMatchingParams(pattern, finalPattern)) {
                        throw new Error(`Page override must preserve route parameters: ${pattern}`);
                    }

                    injectRoute({
                        pattern: finalPattern,
                        entrypoint: new URL(entrypoint, import.meta.url),
                        prerender: true,
                    });
                }

                logger.info("Theme routes and Material 3 modules registered");
            },
            "astro:config:done": ({ injectTypes }) => {
                injectTypes({
                    filename: "astro-mochi-tones.d.ts",
                    content: `
declare module "astro-mochi-tones:config" {
    const config: import("astro-mochi-tones").MochiTonesConfig;
    export default config;
}
declare module "astro-mochi-tones:components/*" {
    const Component: any;
    export default Component;
}
declare module "astro-mochi-tones:layouts/*" {
    const Component: any;
    export default Component;
}
declare module "astro-mochi-tones:styles/*";
`,
                });
            },
        },
    };
}
