import { Md5Benchmark } from './Md5Benchmark';
import { Argon2Benchmark } from './Argon2Benchmark';

export class Init {
  static async main() {
    const { Bench } = await import('tinybench');
    const bench = new Bench({
      time: 3000,
    });

    const works = await Promise.all([
      Md5Benchmark.generate(),
      Argon2Benchmark.generate()
    ]);
    
    for (const [name, benchmark] of Object.entries(Object.assign(...works))) {
      bench.add(name, async () => await benchmark.work());
    }

    await bench.warmup();
    await bench.run();

    console.table(
      bench.tasks.map(({ name, result }) => ({
        "Task": name,
        "ops/sec": result?.hz,
        "Min": result?.min,
        "Max": result?.max,
        "Period (ms)": result?.period,
        "Average (ps)": (result?.mean || 0) * 1000,
        "Variance (ps)": (result?.variance || 0) * 1000,
        "p99": result?.p99,
        "Samples": result?.samples.length,
      }))
    );
  }
}

Init.main().catch(console.error);