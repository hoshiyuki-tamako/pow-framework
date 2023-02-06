export interface IWorkGenerator<TData = string, TOption = unknown> {
  generate(option?: TOption): TData | Promise<TData>;
  verify(data: TData, option?: TOption): boolean | Promise<boolean>;
}