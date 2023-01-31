import { IPowRequest, IPowResult } from './model/index';

export interface IPowWorker<
  TPowRequest extends IPowRequest = IPowRequest,
  TPowResult extends IPowResult = IPowResult,
> {
  work(request: TPowRequest): TPowResult | Promise<TPowResult>;
  verify(result: TPowResult): boolean | Promise<boolean>;
}
