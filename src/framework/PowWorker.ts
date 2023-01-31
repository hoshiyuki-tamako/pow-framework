import { IPowRequest, IPowResult } from './../models';

export interface IPowWorker<
  TPowRequest extends IPowRequest = IPowRequest,
  TPowResult extends IPowResult = IPowResult,
> {
  work(request: TPowRequest): TPowResult | Promise<TPowResult>;
  verify(result: TPowResult): boolean | Promise<boolean>;
}
