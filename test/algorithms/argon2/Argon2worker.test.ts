import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { Argon2Verifier, Argon2Worker } from '../../../src/algorithms';
import { WorkString } from '../../../src/generators';
import { BaseTest } from '../../Base.test';
import { IterationLimited, PowOverworkError } from './../../../src';

dayjs.extend(duration);

@suite()
export class Argon2VerifierTest extends BaseTest {
  @test()
  public async strategy() {
    const verifier = new Argon2Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();

    const worker = new Argon2Worker({
      strategy: new IterationLimited(1),
    });
    await expect(worker.work(request)).rejectedWith(PowOverworkError);
  }
}
