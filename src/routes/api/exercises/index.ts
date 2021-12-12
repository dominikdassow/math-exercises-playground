import type { RequestHandler } from "@sveltejs/kit"
import { init } from "$lib/database"
import type { ExerciseData } from "$lib/model/exercise"
import type { DefaultBody } from "@sveltejs/kit/types/endpoint"

type Request = RequestHandler<Record<string, never>, Record<string, never>, ExerciseData[] & DefaultBody>

export const get: Request = async () => {
  const database = await init()

  return {
    status: 200,
    body: Array.from(database.exercises, ([slug, exercise]) => ({
      slug,
      name: exercise.name,
      color: exercise.color
    }))
  }
}
