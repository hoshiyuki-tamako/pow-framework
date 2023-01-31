export interface IPowResult<TData = string, TResult = string> {
  data: TData;
  result: TResult;
}

export class PowResult<TData = string, TResult = string> implements IPowResult<TData, TResult> {
  data: TData;
  result: TResult;

  constructor(data: TData, result: TResult) {
    this.data = data;
    this.result = result;
  }
}
