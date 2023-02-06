import { PowUnsupportedGenerateType } from './../../src/framework/error/PowUnsupportedGenerateType';
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { WorkDate } from '../../src';
import { BaseTest } from '../Base.test';

dayjs.extend(duration);

@suite()
export class WorkDateTest extends BaseTest {
  @test()
  generateString() {
    const workGenerator = new WorkDate();
    const data = workGenerator.generate({
      type: "string"
    });
    expect(data).a('string');
    expect(workGenerator.verify(data)).true;
  }

  @test()
  generateDate() {
    const workGenerator = new WorkDate();
    const data = workGenerator.generate({
      type: "date"
    });
    expect(data).a('date');
    expect(workGenerator.verify(data)).true;
  }

  @test()
  generateNumber() {
    const workGenerator = new WorkDate();
    const data = workGenerator.generate({
      type: "number"
    });
    expect(data).a('number');
    expect(workGenerator.verify(data)).true;
  }

  @test()
  generateInvalid() {
    const workGenerator = new WorkDate();
    expect(() => workGenerator.generate({
      type: "asd" as never
    })).throw(PowUnsupportedGenerateType);
  }

  @test()
  verify() {
    const workGenerator = new WorkDate();
    const data = workGenerator.generate();
    expect(data).a('string');
    expect(workGenerator.verify(data)).true;
  }

  @test()
  verifyFail() {
    const workGenerator = new WorkDate();
    expect(workGenerator.verify("asd")).false;
  }
}
