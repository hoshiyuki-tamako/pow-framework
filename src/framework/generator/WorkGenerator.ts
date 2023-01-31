export interface IWorkGenerator<TData = string> {
  generate(): TData | Promise<TData>;
  verify(data: TData): boolean | Promise<boolean>;
}