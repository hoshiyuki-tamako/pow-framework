import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { BaseTest } from '../../Base.test';
import { Md5Verifier, Md5Worker } from './../../../src/algorithms';

dayjs.extend(duration);

@suite()
export class Md5Test extends BaseTest {
  @test()
  public basic() {
    const verifier = new Md5Verifier();
    const request = verifier.generate();

    const worker = new Md5Worker();
    const result = worker.work(request);

    const correct = verifier.verify(result);

    expect(correct).true;
  }
}
