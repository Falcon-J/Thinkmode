
import "dotenv/config";
import OpenAI from "openai";
import { ThinkMode } from "../dist/index.js";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment");
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const tm = new ThinkMode();

tm.step("plan", async (ctx) => {
  return { ...ctx, action: "answer" };
});

tm.step("llm", async (ctx) => {
  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: ctx.input }],
    max_tokens: 100,
    temperature: 0.7
  });

  return {
    ...ctx,
    answer: res.choices[0].message.content
  };
});

tm.step("respond", async (ctx) => {
  return { ...ctx, output: ctx.answer };
});

const res = await tm.run("Explain Node.js in one line");
console.log(res.output);