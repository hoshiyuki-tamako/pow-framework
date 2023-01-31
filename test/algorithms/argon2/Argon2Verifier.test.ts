import { WorkEmpty } from '../../../src/generators/WorkEmpty';
import { Argon2Result } from '../../../src/algorithms/argon2/models/Argon2Result';
import { ArgonType } from 'argon2-browser';
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { Argon2Verifier, Argon2Worker } from '../../../src/algorithms/index';
import { WorkString } from '../../../src/generators/index';
import { BaseTest } from '../../Base.test';

dayjs.extend(duration);

@suite()
export class Argon2VerifierTest extends BaseTest {
  @test()
  public async complexity0() {
    const complexity = 0;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      complexity,
    });
    const request = await verifier.generate();
    expect(request.option.complexity).eq(complexity);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }

  @test()
  public async complexity1() {
    const complexity = 1;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      complexity,
    });
    const request = await verifier.generate();
    expect(request.option.complexity).eq(complexity);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }

  @test()
  public async complexityInvalid() {
    {
      const complexity = Number.MIN_SAFE_INTEGER as never;
      const verifier = new Argon2Verifier({
        workGenerator: new WorkString(),
        complexity,
      });
      const request = await verifier.generate();
      expect(request.option.complexity).eq(Argon2Verifier.defaultOption.complexityRange[0]);

      const worker = new Argon2Worker();
      const result = await worker.work(request);
      const correct = verifier.verify(result);
      expect(correct).true;
    }

    {
      const complexity = Number.MAX_SAFE_INTEGER as never;
      const verifier = new Argon2Verifier({
        workGenerator: new WorkString(),
        complexity,
      });
      const request = await verifier.generate();
      expect(request.option.complexity).eq(Argon2Verifier.defaultOption.complexityRange[1]);

      const worker = new Argon2Worker();
      const result = await worker.work(request);
      const correct = verifier.verify(result);
      expect(correct).true;
    }
  }

  @test()
  public async argon2i() {
    const type = ArgonType.Argon2i;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }

  @test()
  public async argon2d() {
    const type = ArgonType.Argon2d;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }

  @test()
  public async argon2id() {
    const type = ArgonType.Argon2id;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }

  @test()
  public async missMatchArgon2Type() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: {
        type: ArgonType.Argon2id,
      }
    });
    const request = await verifier.generate();
    request.option.argon2.type = ArgonType.Argon2i;

    const worker = new Argon2Worker();
    const result = await worker.work(request);

    const correct = verifier.verify(result);
    expect(correct).false;
  }

  @test()
  public async workGenerator() {
    {
      const verifier = new Argon2Verifier({
        workGenerator: new WorkEmpty(),
      });
      const request = await verifier.generate();
      expect(request.data).empty;
    }

    {
      const verifier = new Argon2Verifier({
        workGenerator: new WorkString(),
      });
      const request = await verifier.generate();
      expect(request.data).not.empty;
    }
  }

  @test()
  public async generate() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();
    expect(request.data).not.empty;
    expect(request.option.complexity).eq(Argon2Verifier.defaultOption.complexity);
    expect(request.option.argon2.type).eq(ArgonType.Argon2id);
  }

  @test()
  public async verify() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();

    const worker = new Argon2Worker();
    const result = await worker.work(request);

    const correct = verifier.verify(result);

    expect(correct).true;
  }

  @test()
  public async verifyFail() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    expect(await verifier.verify(new Argon2Result('', ''))).false;
    expect(await verifier.verify(new Argon2Result('abc', 'abc'))).false;
  }
}
