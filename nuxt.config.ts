// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [],
      link: [
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
  },
});
