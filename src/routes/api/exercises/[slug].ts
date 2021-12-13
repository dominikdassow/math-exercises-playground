import type { RequestHandler } from "@sveltejs/kit"
import { init as initDatabase } from "$lib/database"
import type { Exercise, ExerciseDetails } from "$lib/model/exercise"
import evaluatex from "evaluatex/dist/evaluatex"
import type { DefaultBody } from "@sveltejs/kit/types/endpoint"

const parseDynamics = (dynamic: string): string => {
  return evaluatex(dynamic, {
    random_number: (min, max) => Math.floor(Math.random() * max) + min
  })()
}

const createExpression = (exercise: Exercise): string => {
  return exercise.expression.replace(/&(\w+)&/g, (match: string, dynamic: string) => {
    if (!exercise.dynamics.has(dynamic)) throw new Error(`Dynamic "${match}" not specified`)

    return parseDynamics(exercise.dynamics.get(dynamic))
  })
}

type Request = RequestHandler<Record<string, never>, Record<string, never>, ExerciseDetails & DefaultBody>

export const get: Request = async ({ params }) => {
  const { slug } = params,
    database = await initDatabase()

  if (!database.exercises.has(slug)) return

  const exercise = database.exercises.get(slug)

  return {
    status: 200,
    body: {
      slug,
      name: exercise.name,
      color: exercise.color,
      expression: createExpression(exercise)
    }
  }
}
