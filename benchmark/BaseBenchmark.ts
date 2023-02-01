export interface Benchmark<TResult = unknown> {
  work(): TResult | Promise<TResult>;
}