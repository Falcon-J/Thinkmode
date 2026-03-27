// Flow implementation

import type { Step, Handlers } from "./types.js"

export function createFlow(handlers: Handlers = {}) {
  const steps: Step[] = []
  const start = Date.now()

  function emit(step: Step) {
    const enriched = { ...step, ts: Date.now() - start }
    steps.push(enriched)
    handlers.onStep?.(enriched)
  }

  return {
    input(text: string) {
      emit({ type: "input", content: text })
    },

    intent(text: string) {
      emit({ type: "intent", content: text })
    },

    tool(name: string, input: any, output?: any) {
      emit({
        type: "tool",
        content: name,
        meta: { input, output }
      })
    },

    scratchpad(text: string) {
      emit({ type: "scratchpad", content: text })
    },

    response(text: string) {
      emit({ type: "response", content: text })
      handlers.onComplete?.()
    },

    error(err: Error) {
      emit({ type: "error", content: err.message })
      handlers.onError?.(err)
    },

    export() {
      return { steps }
    },

    replay(speed = 1) {
      let i = 0

      function next() {
        if (i >= steps.length) return
        const step = steps[i]
        if (step) handlers.onStep?.(step)
        i++
        setTimeout(next, 300 / speed)
      }

      next()
    }
  }
}