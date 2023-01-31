import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { IterationLimited } from '../../src';
import { BaseTest } from '../Base.test';

@suite()
export class IterationLimitedTest extends BaseTest {
  @test()
  run() {
    let iteration = 3;
    const condition = new IterationLimited(3);
    condition.reset();
    while (iteration-- > 0) {
      expect(condition.shouldContinue()).true;
    }
    expect(condition.shouldContinue()).false;
    expect(condition.shouldContinue()).false;
  }

  @test()
  runInvalidValue() {
    const condition = new IterationLimited(Number.MIN_SAFE_INTEGER);
    condition.reset();
    expect(condition.shouldContinue()).false;
  }

  @test()
  runDefaultIteration() {
    const condition = new IterationLimited();
    condition.reset();
    expect(condition.shouldContinue()).false;
  }
}
