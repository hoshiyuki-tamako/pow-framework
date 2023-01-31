import { IPowResult } from '../../models/index';

export type StrategyResult = IPowResult | undefined | null;
export type StrategyReturn = StrategyResult | Promise<StrategyResult>;
export type StrategyRunOption = {
  abortController: AbortController;
};
export type WorkFunction = (option: StrategyRunOption) => StrategyReturn;
export interface IStrategy<TOption = Record<string, unknown>> {
  run(fn: WorkFunction, option?: TOption): IPowResult | Promise<IPowResult>;
}
