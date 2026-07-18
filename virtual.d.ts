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
