<script lang="ts">
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import { ExerciseData } from "$lib/model/exercise"
  import { onMount } from "svelte"

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await scrollIntoView($page.params.slug, 0)
  })

  const getExercises: () => Promise<ExerciseData[]> = async () => {
    const response = await fetch("/api/exercises")

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return await response.json()
  }

  const scrollIntoView = async (slug: string, delay: number) => {
    await new Promise(resolve => setTimeout(resolve, delay))

    let element = document.querySelector(`[data-slug="${slug}"]`)
    if (!element) return

    window.requestAnimationFrame(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      })
    })
  }

  const select = async (exercise: ExerciseData) => {
    await goto(`/exercises/${exercise.slug}`)
    await scrollIntoView(exercise.slug, 200)
  }

  $: allExercises = getExercises()
</script>

<div class="exercises">
  {#await allExercises then exercises}
    {#each exercises as exercise}
      <div data-slug={exercise.slug} class="card transform color-{exercise.color}" class:selected={exercise.slug === $page.params.slug} on:click={select(exercise)}>
        {exercise.name}
      </div>
    {/each}
  {/await}
</div>

<div class="content">
  <slot />
</div>

<style lang="scss">
  ::-webkit-scrollbar {
    display: none;
  }

  .exercises {
    @apply relative w-full flex gap-6 overflow-x-auto;
    @apply before:flex-[1_0_10vw] after:flex-[1_0_10vw];
    @apply pb-20;

    .card {
      @apply flex-none;
      @apply snap-center shrink-0;
      @apply bg-gradient-to-r;
      @apply text-white cursor-pointer;
      @apply transition border-y-8 border-transparent hover:border-b-white/50;

      &.selected {
        @apply border-b-white/50;
      }

      &.color-blue {
        @apply from-sky-400 to-indigo-500;
      }

      &.color-red {
        @apply from-pink-500 to-rose-500;
      }

      &.color-green {
        @apply from-green-400 to-cyan-500;
      }

      &.color-purple {
        @apply from-fuchsia-500 to-purple-600;
      }

      &.color-yellow {
        @apply from-amber-400 to-orange-500;
      }
    }
  }

  .content {
    @apply mx-auto max-w-screen-md;
  }
</style>
