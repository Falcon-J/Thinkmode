// Type definitions

export type StepType =
  | "input"
  | "intent"
  | "tool"
  | "scratchpad"
  | "response"
  | "error"

export type Step = {
  type: StepType
  content: string
  meta?: any
  ts?: number
}

export type Handlers = {
  onStep?: (step: Step) => void
  onComplete?: () => void
  onError?: (err: Error) => void
}