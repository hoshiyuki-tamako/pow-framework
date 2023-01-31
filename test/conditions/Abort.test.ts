import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Abort } from '../../src';
import { BaseTest } from '../Base.test';

@suite()
export class AbortTest extends BaseTest {
  @test()
  run() {
    const abortController = new AbortController();
    const condition = new Abort(abortController);
    expect(condition.shouldContinue()).true;
    abortController.abort();
    expect(condition.shouldContinue()).false;
  }
}
