import { ThinkMode } from '../dist/index.js';

const docs = [
  { text: "Node.js is a JavaScript runtime" },
  { text: "React is a frontend library" }
];

function retrieve(query) {
  return docs.find(d =>
    d.text.toLowerCase().includes(query.toLowerCase())
  );
}

const tm = new ThinkMode();

// NO next anywhere
tm.step('plan', async (ctx) => {
  return { ...ctx, action: 'search' };
});

tm.step('retrieve', async (ctx) => {
  const doc = retrieve(ctx.input);
  return { ...ctx, doc };
});

tm.step('respond', async (ctx) => {
  return {
    ...ctx,
    output: ctx.doc ? ctx.doc.text : 'No results'
  };
});

const res = await tm.run('node');
console.log(res.output);