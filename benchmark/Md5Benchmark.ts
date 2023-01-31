import { Md5ComplexityRange, Md5Verifier, Md5Worker } from '../src/algorithms';
import { Md5 } from './../src';

export class Md5Benchmark {
  static generate() {
    let i = Md5.defaultOption.complexityRange.at(-1) as number;
    const tests = {} as Record<string, Md5Benchmark>;
    while (i-- > 0) {
      const test = new this(i as Md5ComplexityRange);
      tests[`md5-${i}`] = test;
    }
    return tests;
  }

  #verifier = new Md5Verifier();
  #worker = new Md5Worker();

  #data = this.#verifier.generate();

  constructor(complexity: Md5ComplexityRange) {
    this.#verifier = new Md5Verifier({ complexity });
  }

  work() {
    return this.#worker.work(this.#data);
  }
}