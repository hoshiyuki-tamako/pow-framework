import { ArgonType } from 'argon2-browser';

import { Argon2, Argon2Option, Argon2Request, Argon2VerifierWithJwtLocal, Argon2Worker } from '../src';
import { Benchmark } from './BaseBenchmark';

export class Argon2Benchmark implements Benchmark {

  static async generate() {
    const tests = {} as Record<string, Argon2Benchmark>;

    for (const name of Object.keys(ArgonType).filter((v) => isNaN(+v))) {
      for (const complexity of Array(Argon2.defaultOption.complexityRange.length).keys()) {
        tests[`${name}-${complexity}`] = await new this({
          complexity,
          argon2: {
            type: ArgonType[name as keyof typeof ArgonType],
          },
        }).init();
      }
    }

    return tests;
  }

  #verifier: Argon2VerifierWithJwtLocal;
  #data!: Argon2Request;

  #worker = new Argon2Worker();

  constructor(option: Partial<Argon2Option>) {
    this.#verifier = new Argon2VerifierWithJwtLocal(option);
  }

  async init() {
    this.#data = await this.#verifier.generate();
    return this;
  }

  async work() {
    await this.#worker.work(this.#data);
  }
}