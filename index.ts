import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

export default defineTheme({
    name: "astro-mochi-tones",
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        author: z.string().optional(),
        footerSlogan: z.string().optional(),
        waline: z
            .object({
                serverURL: z.string().url().optional(),
            })
            .optional(),
    }),
});
