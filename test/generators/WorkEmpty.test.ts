import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { BaseTest } from '../Base.test';
import { WorkEmpty } from './../../src';

dayjs.extend(duration);

@suite()
export class WorkEmptyTest extends BaseTest {
  @test()
  generateVerify() {
    const workGenerator = new WorkEmpty();
    const data = workGenerator.generate();
    expect(data).empty;
    expect(workGenerator.verify(data)).true;
  }
}
