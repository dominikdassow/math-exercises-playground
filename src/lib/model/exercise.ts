import { Transform } from "class-transformer"
import createMapTransformFn from "create-map-transform-fn"

export class Exercise {
  expression: string

  @Transform(createMapTransformFn(String))
  dynamics: Map<string, string>
}

export type ExerciseData = {
  slug: string
}

export type ExerciseDetails = {
  slug: string
  expression: string
}
