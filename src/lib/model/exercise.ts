import { Transform } from "class-transformer"
import createMapTransformFn from "create-map-transform-fn"

export class Exercise {
  name: string
  color: string
  expression: string

  @Transform(createMapTransformFn(String))
  dynamics: Map<string, string>
}

export interface ExerciseData {
  slug: string
  name: string
  color: string
}

export interface ExerciseDetails extends ExerciseData {
  expression: string
}
