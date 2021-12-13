import { ClassConstructor, instanceToPlain, plainToInstance, TransformationType, TransformFnParams } from "class-transformer"

/**
 * @see https://gist.github.com/jeongtae/f65ddd8f17f8c388659aab76890f194b
 *
 * Create a transformation function for `Transform` decorator which decorates `Map<string, any>` type property.
 * @param mapValueClass Type of value. (e.g. `MyClass`, `Number`, `String`, `Boolean` ...)
 */
export default function createMapTransformFn<T>(mapValueClass: ClassConstructor<T>) {
  return ({ type, value, options }: TransformFnParams): any => {
    const isPrimitiveClass = [String, Number, Boolean].includes(mapValueClass as any)

    switch (type) {
      case TransformationType.PLAIN_TO_CLASS: {
        if (value instanceof Object === false) {
          const emptyMap = new Map()
          return emptyMap
        }
        const transformedEntries = Object.entries(value)
          .filter(([, v]) => {
            return isPrimitiveClass || typeof v === "object"
          })
          .map(([k, v]) => {
            return [k, isPrimitiveClass ? (mapValueClass as any)(v) : plainToInstance(mapValueClass, v, options)]
          }) as [string, T][]
        const transformedMap = new Map(transformedEntries)
        return transformedMap
      }

      case TransformationType.CLASS_TO_PLAIN: {
        if (value instanceof Map === false) {
          const emptyObject = {}
          return emptyObject
        }
        const transformedEntries = Array.from((value as Map<string, T>).entries())
          .filter(([k, v]) => {
            return typeof k === "string" && (isPrimitiveClass || v instanceof mapValueClass)
          })
          .map(([k, v]) => {
            return [k, isPrimitiveClass ? (mapValueClass as any)(v) : instanceToPlain(v, options)]
          })
        const transformedObject = Object.fromEntries(transformedEntries)
        return transformedObject
      }

      default:
        return value
    }
  }
}
