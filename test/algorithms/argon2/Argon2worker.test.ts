import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Argon2Verifier, Argon2Worker, IterationLimited, PowOverworkError, WorkString } from '../../../src';
import { BaseTest } from '../../Base.test';


@suite()
export class Argon2WorkerTest extends BaseTest {
  @test()
  async conditions() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();

    const worker = new Argon2Worker({
      conditions: [new IterationLimited(1)],
    });
    await expect(worker.work(request)).rejectedWith(PowOverworkError);
  }
}
