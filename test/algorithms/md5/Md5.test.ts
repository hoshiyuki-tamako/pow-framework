import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { BaseTest } from '../../Base.test';
import { Md5Verifier, Md5Worker, WorkString } from '../../../src';

dayjs.extend(duration);

@suite()
export class Md5Test extends BaseTest {
  @test()
  async generateVerify() {
    const verifier = new Md5Verifier({
      workGenerator: new WorkString(),
    });
    const request = await verifier.generate();

    const worker = new Md5Worker();
    const result = await worker.work(request);

    const correct = await verifier.verify(result);

    expect(correct).true;
  }
}
