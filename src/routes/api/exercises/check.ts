import type { RequestHandler } from "@sveltejs/kit"
import evaluatex from "evaluatex"

type Body = {
  expression: string
  result: string
}

type Output = {
  expression: string
  result: number
  correct: boolean
}

type Error = {
  error: string
}

type Request = RequestHandler<Record<string, never>, Body, Output | Error>

export const post: Request = async ({ body }) => {
  if (!body) return { status: 400, body: { error: "No data specified" } }

  const expression = body.expression,
    result = parseFloat(body.result)

  if (!expression) return { status: 400, body: { error: "No expression specified" } }
  if (!result || isNaN(result)) return { status: 400, body: { error: "No or non-numerical result specified" } }

  const evaluation: number = evaluatex(expression)()
  const correct = evaluation.toFixed(10) === result.toFixed(10)

  return {
    status: 200,
    body: { expression, result, correct }
  }
}
