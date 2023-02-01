import { Md5VerifierWithJwtLocal, Md5Worker, PowRequest } from '../src';
import { Benchmark } from './BaseBenchmark';

export class Md5Benchmark implements Benchmark {
  static async generate() {
    return {
      "md5": await new this().init(),
    };
  }

  #verifier: Md5VerifierWithJwtLocal;
  #data!: PowRequest;

  #worker = new Md5Worker();

  constructor() {
    this.#verifier = new Md5VerifierWithJwtLocal();
  }

  async init() {
    this.#data = await this.#verifier.generate();
    return this;
  }

  async work() {
    await this.#worker.work(this.#data);
  }
}