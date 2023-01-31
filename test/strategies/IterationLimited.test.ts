import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { IterationLimited, PowOverworkError, PowResult } from '../../src';
import { BaseTest } from '../Base.test';

@suite()
export class IterationLimitedTest extends BaseTest {
  @test()
  public async run() {
    const iteration = 3;
    let i = 0;
    const strategy = new IterationLimited(iteration);
    await strategy.run(() => {
      if (i++ >= iteration) {
        return new PowResult("", "");
      }
      return undefined;
    });
    expect(i).eq(iteration + 1);
  }

  public async runLimited() {
    const iteration = 3;
    let i = 0;
    const strategy = new IterationLimited(iteration);
    const promise = strategy.run(() => {
      i++;
      return undefined;
    });
    await expect(promise).rejectedWith(PowOverworkError);
    expect(i).eq(iteration + 1);
  }

  public async runAbortController() {
    const iteration = 3;
    let i = 0;
    const strategy = new IterationLimited(iteration);
    const promise = strategy.run(({ abortController }) => {
      i++;
      abortController.abort();
      return undefined;
    });
    await expect(promise).rejectedWith(PowOverworkError);
    expect(i).eq(1);
  }
}
