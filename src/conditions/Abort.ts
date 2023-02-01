import { ICondition } from '../framework';

export interface AbortOption {
  signal: AbortSignal;
}

export class Abort implements ICondition {
  signal: AbortSignal;

  constructor(option: AbortOption) {
    this.signal = option.signal;
  }

  shouldContinue() {
    return !this.signal.aborted;
  }
}