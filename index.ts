import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

const navItemSchema = z.object({
    label: z.string(),
    icon: z.string(),
    href: z.string(),
    activePattern: z.string().optional(),
});

const footerLinkSchema = z.object({
    label: z.string(),
    href: z.string(),
    external: z.boolean().optional(),
});

export default defineTheme({
    name: "astro-mochi-tones",
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        author: z.string().optional(),
        lang: z.string().default("zh-CN"),
        locale: z.string().default("zh_CN"),
        favicon: z.string().default("/favicon.svg"),
        defaultImage: z.string().default("/images/default-og.png"),
        rssPath: z.string().default("/rss.xml"),
        searchPath: z.string().default("/search.json"),
        fonts: z
            .array(
                z.object({
                    href: z.string().url(),
                    rel: z.string().default("stylesheet"),
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
            .default({}),
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
                themeCreditHref: z
                    .string()
                    .default("https://github.com/vahiru/Astro-Mochi-Tones"),
                showThemeCredit: z.boolean().default(true),
            })
            .default({}),
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
                categoriesTitle: z.string().default("Categories"),
                noCategories: z.string().default("No categories"),
                paginationPrevious: z.string().default("Previous"),
                paginationNext: z.string().default("Next"),
                pageInfoTemplate: z.string().default("Page {current} of {total}"),
            })
            .default({}),
        colorPicker: z
            .object({
                defaultColor: z.string().default("#6750a4"),
                presetColors: z
                    .array(z.string())
                    .default([
                        "#6750a4",
                        "#9c4146",
                        "#006a6a",
                        "#5d5f00",
                        "#006e1c",
                    ]),
            })
            .default({}),
        waline: z
            .object({
                serverURL: z.string().url().optional(),
                cssURL: z
                    .string()
                    .url()
                    .default("https://unpkg.com/@waline/client@3/dist/waline.css"),
                emojis: z
                    .array(z.string())
                    .default([
                        "//unpkg.com/@waline/emojis@1.1.0/weibo",
                        "//unpkg.com/@waline/emojis@1.1.0/bilibili",
                    ]),
                pageview: z.boolean().default(true),
                comment: z.boolean().default(true),
                dark: z.string().default("html.dark"),
            })
            .optional(),
    }),
});
