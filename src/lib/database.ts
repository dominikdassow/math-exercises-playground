import YAML from "yaml"
import { readFile } from "fs/promises"
import { plainToInstance, Transform } from "class-transformer"
import createMapTransformFn from "create-map-transform-fn"
import { Exercise } from "$lib/model/exercise"

export class Database {
  @Transform(createMapTransformFn(Exercise))
  exercises: Map<string, Exercise>
}

export const init = async (): Promise<Database> => {
  const data = YAML.parse(await readFile("data/database.yaml", "utf8"))

  return plainToInstance(Database, data)
}
