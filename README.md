
## ThinkMode

Minimal pipeline engine for building AI systems.

A lightweight alternative to heavy agent frameworks.

---

## Install

```bash
npm install thinkmode
```
## Core Idea

```
input → plan → execute → respond
```

---

## Usage

```js
import { ThinkMode } from "thinkmode";

const tm = new ThinkMode();

tm.step("plan", async (ctx) => {
  return { ...ctx, action: "greet" };
});

tm.step("respond", async (ctx) => {
  return { ...ctx, output: "hi" };
});

const res = await tm.run("hello");
console.log(res.output);
```

---

## Example: LLM Integration

```js
tm.step("llm", async (ctx) => {
  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: ctx.input }]
  });

  return {
    ...ctx,
    answer: res.choices[0].message.content
  };
});
```

---

## Dynamic Routing

Override flow when needed:

```js
tm.step("plan", async (ctx) => {
  if (ctx.input.includes("price")) {
    return { ...ctx, next: "pricing" };
  }
  return ctx;
});
```

---

## API

### `new ThinkMode()`

Create a pipeline instance.

---

### `step(name, fn)`

Register a step.

* `name`: string
* `fn(ctx)`: async function returning updated context

---

### `run(input)`

Execute pipeline.

Returns final `ctx`.

---

## Context (`ctx`)

All data flows through a single object:

```js
{
  input,
  action,
  data,
  next,
  output,
  error
}
```

---

## Features

* Step-based pipeline
* Dynamic routing via `ctx.next`
* Built-in timeout handling
* Fail-fast error handling
* Zero dependencies

---

## v2 Changes

* Replaced event system (`on`) with step-based pipeline (`step`)
* Added dynamic routing
* Added execution safety (timeouts, loop protection)

---

## License

MIT

