import adapter from "@sveltejs/adapter-auto"
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
    adapter: adapter(),
    target: "#svelte",
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@import "src/variables.scss";'
          }
        }
      }
    }
  }
}

export default config
