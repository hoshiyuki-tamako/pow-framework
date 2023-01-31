export interface IPowRequest<TData = string> {
  data: TData;
}

export interface IPowRequestWithOption<TData = string, TOption = Record<string, unknown>> extends IPowRequest<TData> {
  option: TOption;
}

export class PowRequest<TData = string> implements IPowRequest<TData> {
  data: TData;

  constructor(data: TData) {
    this.data = data;
  }
}

export abstract class PowRequestWithOption<TData = string, TOption = Record<string, unknown>> extends PowRequest<TData> {
  option: TOption;

  constructor(data: TData, option: TOption) {
    super(data);
    this.option = option;
  }
}

export interface ComplexityOption<TComplexity = number> extends Record<string, unknown> {
  complexity: TComplexity;
}

export abstract class PowRequestWithDefaultOption<TData = string, TOption = ComplexityOption> extends PowRequest<TData> {
  option: TOption;

  constructor(data: TData, option: TOption) {
    super(data);
    this.option = option;
  }
}
