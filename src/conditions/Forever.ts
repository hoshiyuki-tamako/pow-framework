import { ICondition } from '../framework';

export class Forever implements ICondition {
  shouldContinue() {
    return true;
  }
}