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

// 自托管字体通过 `?url` 导入，用于在 <head> 里预加载带哈希的资源地址。
declare module "*.woff2?url" {
    const url: string;
    export default url;
}
