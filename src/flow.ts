type Ctx = Record<string, any>;
const MAX_STEPS = 20;
function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

export class ThinkMode {
  private steps: { name: string; fn: (ctx: Ctx) => Promise<Ctx> }[] = [];

  step(name: string, fn: (ctx: Ctx) => Promise<Ctx>) {
    if (!name || typeof fn !== 'function') {
      throw new Error('Invalid step registration');
    }
    this.steps.push({ name, fn });
  }

  // temporary backward compatibility
  on(name: string, fn: (ctx: Ctx) => Promise<Ctx>) {
    return this.step(name, fn);
  }

  async run(input: string) {
    if (!input) throw new Error('Input required');

    let ctx: Ctx = { input };
    let i = 0;
    let stepsRun = 0;

    while (i < this.steps.length) {
      if (stepsRun++ > MAX_STEPS) {
        throw new Error('Max steps exceeded (possible infinite loop)');
      }
      const { name, fn } = this.steps[i];

      try {
        ctx = await withTimeout(fn(ctx));
      } catch (err: any) {
        return {
          ...ctx,
          error: err.message,
          failed_step: name,
        };
      }

      if (!ctx || typeof ctx !== 'object') {
        throw new Error(`Invalid ctx at step "${name}"`);
      }

      if (ctx.next) {
        const nextIndex = this.steps.findIndex(s => s.name === ctx.next);
        if (nextIndex === -1) {
          throw new Error(`Unknown step "${ctx.next}"`);
        }
        i = nextIndex;
        continue;
      }

      i++;
    }

    return ctx;
  }
}