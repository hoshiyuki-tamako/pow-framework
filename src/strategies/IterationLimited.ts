import { IStrategy, PowOverworkError, WorkFunction } from '../framework';

export class IterationLimited implements IStrategy {
  static readonly defaultOptions = {
    iteration: 0,
  };

  iteration = IterationLimited.defaultOptions.iteration;

  constructor(iteration = IterationLimited.defaultOptions.iteration) {
    this.iteration = iteration;
  }

  async run(fn: WorkFunction) {
    const abortController = new AbortController();
    let i = 0;
    do {
      const result = await fn({ abortController });
      if (result) {
        return result;
      }
    } while (!abortController.signal.aborted && (!this.iteration || this.iteration >= i++));
    throw new PowOverworkError();
  }
}