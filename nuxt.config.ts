// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "th",
        class: "overflow-x-hidden",
      },
      bodyAttrs: {
        class: "bg-white overflow-x-hidden",
      },
      title: "SFM",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "SFM - Sports Facility Management ระบบจัดการสนามกีฬาภายในชุมชนครบวงจร",
        },
      ],
      script: [],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/icon.svg",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Anuphan:wght@200;300;400;500;600;700&family=Bai+Jamjuree:wght@400;500;600;700&display=swap",
        },
        {
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css",
          rel: "stylesheet",
        },
      ],
    },
  },
  css: ["@/assets/main.css"],
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@primevue/nuxt-module",
  ],
  devtools: { enabled: true },
  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      PRIMEUI_LICENSE: process.env.NUXT_PUBLIC_PRIMEUI_LICENSE,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "gsap",
        "gsap/ScrollTrigger",
        "three",
        "three/examples/jsm/controls/OrbitControls.js",
        "three/examples/jsm/loaders/GLTFLoader.js",
      ],
    },
  },
});
