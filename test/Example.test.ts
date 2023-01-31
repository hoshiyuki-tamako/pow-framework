import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import {
  Argon2Verifier,
  Argon2VerifierWithJwt,
  Argon2VerifierWithJwtLocal,
  Argon2Worker,
  ICondition,
  IWorkGenerator,
  Md5Verifier,
  Md5Worker,
  PowOverworkError,
  TimeLimited,
  WorkJwt,
} from '../src';
import { BaseTest } from './Base.test';

dayjs.extend(duration);

@suite()
export class ExampleTest extends BaseTest {
  @test()
  async localMachine() {
    const verifier = new Argon2VerifierWithJwtLocal();
    const worker = new Argon2Worker();
    const request = await verifier.generate();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async multipleMachine() {
    const verifier = new Argon2VerifierWithJwt({
      privateKey: "secret", // secret must be same across all verify servers
    });
    const worker = new Argon2Worker();
    const request = await verifier.generate();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async customExpirationTime() {
    const verifier = new Argon2VerifierWithJwt({
      privateKey: "secret",
      expirationTime: "2m",  // https://www.npmjs.com/package/ms
    });
    const worker = new Argon2Worker();
    const request = await verifier.generate();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async usingWorkCondition() {
    const verifier = new Argon2VerifierWithJwt({
      privateKey: "secret",
      expirationTime: "2m",
    });
    const worker = new Argon2Worker({
      conditions: [new TimeLimited(dayjs.duration({ seconds: 10 }))], // run 10 seconds
    });
    const request = await verifier.generate();
    try {
      const result = await worker.work(request);
      const correct = await verifier.verify(result);
      expect(correct).true;
    } catch (e) {
      if (e instanceof PowOverworkError) {
        expect(e.constructor).eq(PowOverworkError);
      }
    }
  }

  @test()
  async customWorkConditions() {
    const condition = {
      shouldContinue() {
        return Math.random() > .5;
      }

      // optional, reset will be call once before work started
      // reset() {
      // }
    } as ICondition;

    const verifier = new Argon2VerifierWithJwt({
      privateKey: "secret",
      expirationTime: "2m",
    });
    const worker = new Argon2Worker({
      conditions: [condition],
    });
    const request = await verifier.generate();
    try {
      const result = await worker.work(request);
      const correct = await verifier.verify(result);
      expect(correct).true;
    } catch (e) {
      if (e instanceof PowOverworkError) {
        expect(e.constructor).eq(PowOverworkError);
      }
    }
  }

  @test()
  async usingWorkGenerator() {
    const workGenerator = new WorkJwt({
      privateKey: "secret"
    });
    const verifier = new Argon2Verifier({ workGenerator });
    const worker = new Argon2Worker();
    const request = await verifier.generate();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  async customRequestGenerator() {
    const workGenerator = {
      generate() {
        return new Date().toString();
      },
      verify(data: string) {
        return isFinite(+new Date(data));
      }
    } as IWorkGenerator;

    const verifier = new Argon2Verifier({ workGenerator });
    const worker = new Argon2Worker();
    const request = await verifier.generate();
    const result = await worker.work(request);
    const correct = await verifier.verify(result);
    expect(correct).true;
  }

  @test()
  customAlgorithm() {
    const verifier = new Md5Verifier();
    const worker = new Md5Worker();
    const request = verifier.generate();
    const result = worker.work(request);
    const correct = verifier.verify(result);
    expect(correct).true;
  }
}
