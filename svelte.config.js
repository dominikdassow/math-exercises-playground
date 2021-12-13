import cloudflare from "@sveltejs/adapter-cloudflare"
import preprocess from "svelte-preprocess"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true,
      scss: {
        prependData: '@import "src/variables.scss";'
      }
    })
  ],
  kit: {
    adapter: cloudflare(),
    target: "#svelte",
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@import "src/variables.scss";'
          }
        }
      },
      ssr: {
        noExternal: ["evaluatex"]
      }
    }
  }
}

export default config
