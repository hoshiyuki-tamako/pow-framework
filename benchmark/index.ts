import { Md5Benchmark } from './Md5Benchmark';

import { Argon2VerifierWithJwtLocal } from './../src/algorithms/argon2/Argon2Factory';
import { Argon2Worker } from './../src/algorithms/argon2/Argon2Worker';
import { Argon2Request } from './../src/algorithms/argon2/models/Argon2Request';

export class Benchmark {
  static #argon2Verifier = new Argon2VerifierWithJwtLocal();
  static #argon2Worker = new Argon2Worker();
  static #argon2Data: Argon2Request;

  static async main() {
    const { Bench } = await import('tinybench');
    const bench = new Bench({
      time: 3000,
      warmupTime: 1000,
    });

    this.#argon2Data = await this.#argon2Verifier.generate();

    for (const [name, benchmark] of Object.entries(Md5Benchmark.generate())) {
      bench.add(name, benchmark.work.bind(benchmark));
    }

    bench.add('argon2', this.#argon2.bind(this));

    await bench.run();

    console.table(
      bench.tasks.map(({ name, result }) => ({
        "Task Name": name,
        "Period (ms)": result?.period,
        "Samples": result?.samples.length,
        "ops/sec": result?.hz,
        "Average Time (ps)": (result?.mean || 0) * 1000,
        "Variance (ps)": (result?.variance || 0) * 1000,
      }))
    );
  }

  static async #argon2() {
    return await this.#argon2Worker.work(this.#argon2Data);
  }
}

Benchmark.main().catch(console.error);