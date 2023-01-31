import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ConditionRunner, ICondition, PowOverworkError } from '../../../src';
import { BaseTest } from '../../Base.test';

class TestCondition implements ICondition {
  hasReset = false;
  continueCount = 0;
  returnShouldContinue = true;

  shouldContinue() {
    ++this.continueCount;
    return this.returnShouldContinue;
  }

  reset() {
    this.hasReset = true;
    this.continueCount = 0;
  }
}

@suite()
export class ConditionRunnerTest extends BaseTest {
  @test()
  async chainRun() {
    const maxIteration = 3;
    let i = 0;

    const testObject = {};
    const condition1 = new TestCondition();
    const condition2 = new TestCondition();
    const runner = ConditionRunner.chain(condition1).chain(condition2);
    const promise = runner.run(() => {
      if (i++ >= maxIteration) {
        return testObject;
      }
    });
    expect(await promise).eq(testObject);

    expect(condition1.hasReset).true;
    expect(condition1.continueCount).eq(maxIteration + 1);

    expect(condition2.hasReset).true;
    expect(condition2.continueCount).eq(maxIteration + 1);
  }

  @test()
  option() {
    new ConditionRunner();
  }

  @test()
  async runFailed0() {
    const condition1 = new TestCondition();
    condition1.returnShouldContinue = false;
    const runner = ConditionRunner.chain(condition1);
    await expect(runner.run(() => undefined)).rejectedWith(PowOverworkError);

    expect(condition1.hasReset).true;
    expect(condition1.continueCount).eq(1);
  }

  @test()
  async runFailed1() {
    const condition1 = new TestCondition();
    const runner = ConditionRunner.chain(condition1);
    const promise = runner.run(() => {
      condition1.returnShouldContinue = false;
    });
    await expect(promise).rejectedWith(PowOverworkError);

    expect(condition1.hasReset).true;
    expect(condition1.continueCount).eq(2);
  }
}
