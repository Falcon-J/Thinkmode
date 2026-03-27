import { createFlow } from "./dist/index.js"

const flow = createFlow({ onStep: console.log })

flow.input("hello")
flow.intent("greeting")
flow.response("hi")