import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import sleep from 'sleep-promise';

import { TimeLimited } from '../../src';
import { BaseTest } from '../Base.test';

dayjs.extend(duration);

@suite()
export class TimeLimitedTest extends BaseTest {
  @test()
  async run() {
    const duration = dayjs.duration({ seconds: 1 });
    const condition = new TimeLimited(duration);
    condition.reset();
    expect(condition.shouldContinue()).true;
    await sleep(duration.asMilliseconds());
    expect(condition.shouldContinue()).false;
  }

  @test()
  runInvalid() {
    const duration = dayjs.duration({ seconds: 0 });
    const condition = new TimeLimited(duration);
    condition.reset();
    expect(condition.shouldContinue()).false;
  }

  @test()
  async runDefault() {
    const condition = new TimeLimited();
    condition.reset();
    expect(condition.shouldContinue()).true;
    await sleep(TimeLimited.defaultOptions.duration.asMilliseconds());
    expect(condition.shouldContinue()).false;
  }
}
