export interface ICondition {
  shouldContinue(): boolean | Promise<boolean>;
  reset?(): void | Promise<void>;
}