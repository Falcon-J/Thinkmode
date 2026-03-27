const { ThinkMode } = require('./dist/index.cjs');

async function test() {
  const tm = new ThinkMode();

  tm.step('plan', async (ctx) => {
    if (ctx.input.includes('hello')) {
      return { ...ctx, action: 'greet' };
    }
    return { ...ctx, action: 'unknown' };
  });

  tm.step('execute', async (ctx) => {
    if (ctx.action === 'greet') {
      return { ...ctx, data: 'hi' };
    }
    return ctx;
  });

  tm.step('respond', async (ctx) => {
    return {
      ...ctx,
      output: ctx.data || 'I don’t understand',
    };
  });

  const res = await tm.run('hello');
  console.log(res);
}

test();