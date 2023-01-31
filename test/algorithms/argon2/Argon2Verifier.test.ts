import { suite, test } from '@testdeck/mocha';
import { ArgonType } from 'argon2-browser';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { Argon2Result, Argon2Verifier, Argon2Worker, WorkEmpty, WorkString } from '../../../src';
import { BaseTest } from '../../Base.test';

dayjs.extend(duration);

@suite()
export class Argon2VerifierTest extends BaseTest {
  @test()
  async complexity0() {
    const complexity = 0;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      complexity,
    });
    const request = await verifier.generate();
    expect(request.option.complexity).eq(complexity);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async complexity1() {
    const complexity = 1;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      complexity,
    });
    const request = await verifier.generate();
    expect(request.option.complexity).eq(complexity);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async complexityInvalid() {
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
      const correct = await verifier.verify(result);
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
      const correct = await verifier.verify(result);
      expect(correct).true;
    }
  }

  @test()
  async argon2i() {
    const type = ArgonType.Argon2i;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async argon2d() {
    const type = ArgonType.Argon2d;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async argon2id() {
    const type = ArgonType.Argon2id;
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
      argon2: { type },
    });
    const request = await verifier.generate();
    expect(request.option.argon2.type).eq(type);

    const worker = new Argon2Worker();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async missMatchArgon2Type() {
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

    const correct = await verifier.verify(result);
    expect(correct).false;
  }

  @test()
  async workGenerator() {
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
  async generate() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();
    expect(request.data).not.empty;
    expect(request.option.complexity).eq(Argon2Verifier.defaultOption.complexity);
    expect(request.option.argon2.type).eq(ArgonType.Argon2id);
  }

  @test()
  async verify() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();

    const worker = new Argon2Worker();
    const result = await worker.work(request);

    const correct = await verifier.verify(result);

    expect(correct).true;
  }

  @test()
  async verifyFailStructure() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    expect(await verifier.verify(new Argon2Result('', ''))).false;
    expect(await verifier.verify(new Argon2Result('abc', 'abc'))).false;
  }

  @test()
  async verifyFailHash() {
    const hash = "$argon2id$v=19$m=8,t=1,p=1$AFHjkuPP$aaaaaa";
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    expect(await verifier.verify(new Argon2Result('', hash))).false;
    expect(await verifier.verify(new Argon2Result('abc', hash))).false;
  }
}
