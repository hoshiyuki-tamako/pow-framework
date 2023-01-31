import { IPowRequest, IPowResult } from './../models';

export interface IPowVerifier<
  TPowRequest extends IPowRequest = IPowRequest,
  TPowResult extends IPowResult = IPowResult,
> {
  generate(): TPowRequest | Promise<TPowRequest>;
  verify(result: TPowResult): boolean | Promise<boolean>;
}
