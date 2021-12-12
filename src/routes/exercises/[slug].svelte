<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"

  export const load: Load = async ({ page, fetch }) => {
    const { slug } = page.params

    const response = await fetch(`/api/exercises/${slug}`)

    if (!response.ok)
      return {
        status: response.status,
        error: new Error(`Cannot find exercise "${slug}"`)
      }

    return {
      props: {
        exercise: await response.json()
      }
    }
  }
</script>

<script lang="ts">
  import { ExerciseDetails } from "$lib/model/exercise"
  import katex from "katex"

  export let exercise: ExerciseDetails

  let result = ""
  let checked = false
  let correct = false

  $: katexString = katex.renderToString(exercise.expression, {
    displayMode: false,
    throwOnError: false
  })

  $: isDisabled = checked || result.length < 1 || isNaN(Number(result))

  const handleSubmit = async () => {
    console.log("click")

    const response = await fetch("/api/exercises/check", {
      method: "POST",
      body: JSON.stringify({ expression: exercise.expression, result }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    if (response.ok) {
      checked = true
      correct = data.correct
    }

    console.log(response.ok, data)
  }

  const handleKeyPress: (e: KeyboardEvent) => void = e => {
    if (!isDisabled && e.key === "Enter") handleSubmit()
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
    integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="card">
  <div class="expression">
    {@html katexString}
  </div>

  <div class="result" class:correct={checked && correct} class:not-correct={checked && !correct}>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
    </svg>

    <input bind:value={result} on:input={() => (checked = false)} on:keydown={handleKeyPress} placeholder="Your answer" />

    <button on:click={handleSubmit} disabled={isDisabled} class:checked>
      {#if !checked}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      {:else if correct}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      {/if}
    </button>
  </div>
</div>

<style lang="scss">
  .card {
    @apply mx-auto max-w-screen-md p-0;
    @apply flex flex-col;

    .expression {
      @apply p-10 pb-9 text-2xl;
    }

    .result {
      @apply flex items-center;
      @apply border-t-2 border-slate-300 bg-slate-200 rounded-b-xl transition duration-75;

      svg {
        @apply text-slate-400 ml-4;
      }

      input,
      button {
        @apply border-none h-12 px-5 focus:outline-none text-black text-lg bg-transparent;
      }

      input {
        @apply flex-1 border-r-2 border-black;
      }

      button {
        @apply flex-none transition-opacity;

        svg {
          @apply ml-0;
        }

        &[disabled]:not(.checked) {
          @apply opacity-50;
        }
      }

      &.correct {
        svg {
          @apply text-green-800;
        }

        @apply border-green-800 bg-gradient-to-r from-emerald-400 to-green-500;
      }

      &.not-correct {
        svg {
          @apply text-red-800;
        }

        @apply border-red-800 bg-gradient-to-r from-red-400 to-rose-500;
      }
    }
  }
</style>
