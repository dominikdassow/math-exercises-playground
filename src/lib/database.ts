import { plainToInstance, Transform } from "class-transformer"
import createMapTransformFn from "$lib/helper/createMapTransformFn"
import { Exercise } from "$lib/model/exercise"
import * as data from "../../data/database.json"

export class Database {
  @Transform(createMapTransformFn(Exercise))
  exercises: Map<string, Exercise>
}

export const init = async (): Promise<Database> => {
  return plainToInstance(Database, data)
}
