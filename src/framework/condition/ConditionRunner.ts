import { PowOverworkError } from './../errors';
import { ICondition } from './Condition';

export interface ConditionRunnerOption {
  conditions?: ICondition[];
}

export class ConditionRunner implements ICondition {
  static chain(...conditions: ICondition[]) {
    return new this({
      conditions
    });
  }

  #conditions = [] as ICondition[];

  constructor(option?: ConditionRunnerOption) {
    if (option?.conditions?.length) {
      this.chain(...option.conditions);
    }
  }

  chain(...conditions: ICondition[]) {
    this.#conditions.push(...conditions);
    return this;
  }

  async run<TReturn>(fn: () => TReturn | Promise<TReturn>) {
    await this.reset();

    while (await this.shouldContinue()) {
      const result = await fn();
      if (result) {
        return result;
      }
    }

    throw new PowOverworkError();
  }

  async reset() {
    for (const condition of this.#conditions) {
      await condition.reset?.();
    }
  }

  async shouldContinue() {
    for (const condition of this.#conditions) {
      if (!await condition.shouldContinue()) {
        return false;
      }
    }

    return true;
  }
}