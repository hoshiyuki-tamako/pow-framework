import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { BaseTest } from '../Base.test';
import { WorkString } from '../../src';

dayjs.extend(duration);

@suite()
export class WorkStringTest extends BaseTest {
  @test()
  generateVerify() {
    const workGenerator = new WorkString();
    const data = workGenerator.generate();
    expect(data).not.empty;
    expect(workGenerator.verify(data)).true;
  }
}
