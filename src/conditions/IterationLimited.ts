import { ICondition } from '../framework';

export class IterationLimited implements ICondition {
  static readonly defaultOptions = {
    iteration: 0,
  };

  #iteration = IterationLimited.defaultOptions.iteration;
  #currentIteration = 0;

  constructor(iteration = IterationLimited.defaultOptions.iteration) {
    this.#iteration = iteration;
  }

  reset() {
    this.#currentIteration = 0;
  }

  shouldContinue(): boolean | Promise<boolean> {
    return this.#iteration > this.#currentIteration++;
  }
}