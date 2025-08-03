// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    EDITING_CODE: "",
    public: {
      EDITING_CODE: "",
    },
  },
  app: {
    // baseURL: '/workshops/', // This is your repository name prefixed and suffixed with slashes
    // Consider also setting buildAssetsDir if you face issues with asset paths later,
    // though baseURL often handles it for static deployments.
    // buildAssetsDir: '/_nuxt/', // Default, good to confirm
  },
});
