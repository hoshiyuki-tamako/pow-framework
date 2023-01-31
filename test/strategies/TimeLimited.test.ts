import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { TimeLimited, PowOverworkError, PowResult } from '../../src';
import { BaseTest } from '../Base.test';

dayjs.extend(duration);

@suite()
export class TimeLimitedTest extends BaseTest {
  @test()
  public async run() {
    const iteration = 10;
    let i = 0;
    const strategy = new TimeLimited();
    await strategy.run(() => {
      if (i++ >= iteration) {
        return new PowResult("", "");
      }
      return undefined;
    });
    expect(i).eq(iteration + 1);
  }

  @test()
  public async runLimited() {
    let i = 0;
    const duration = dayjs.duration({ seconds: 1 });
    const strategy = new TimeLimited(duration);
    const promise = strategy.run(() => {
      ++i;
      return undefined;
    });
    await expect(promise).rejectedWith(PowOverworkError);
    expect(i).gt(0);
  }

  public async runAbortController() {
    let i = 0;
    const strategy = new TimeLimited();
    const promise = strategy.run(({ abortController }) => {
      i++;
      abortController.abort();
      return undefined;
    });
    await expect(promise).rejectedWith(PowOverworkError);
    expect(i).eq(1);
  }
}
