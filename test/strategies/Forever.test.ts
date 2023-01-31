import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Forever, PowOverworkError } from '../../src';
import { BaseTest } from '../Base.test';

@suite()
export class ForeverTest extends BaseTest {
  @test()
  public async run() {
    const iteration = 10;
    let i = 0;
    const strategy = new Forever();
    const promise = strategy.run(({ abortController }) => {
      if (i++ >= iteration) {
        abortController.abort();
      }
      return undefined;
    });
    await expect(promise).rejectedWith(PowOverworkError);
    expect(i).eq(iteration + 1);
  }
}
