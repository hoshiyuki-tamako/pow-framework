import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Forever } from '../../src';
import { BaseTest } from '../Base.test';

@suite()
export class ForeverTest extends BaseTest {
  @test()
  run() {
    const condition = new Forever();
    expect(condition.shouldContinue()).true;
  }
}
