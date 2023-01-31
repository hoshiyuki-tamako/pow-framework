import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import sleep from 'sleep-promise';
import crypto from 'crypto';

import { WorkJwtLocal } from '../../src';
import { BaseTest } from '../Base.test';

dayjs.extend(duration);

@suite()
export class WorkJwtLocalTest extends BaseTest {
  @test()
  public option() {
    const alg = "ES256";
    const expirationTime = "2m";
    const keyResetDuration = dayjs.duration({ seconds: 0 });
    const workGenerator = new WorkJwtLocal({
      alg,
      expirationTime,
      keyResetDuration,
    });
    expect(workGenerator.expirationTime).eq(expirationTime);
  }

  @test()
  public async generateResetKey() {
    const keyResetDuration = dayjs.duration({ seconds: 1 });
    const workGenerator = new WorkJwtLocal({
      keyResetDuration,
    });

    const data1 = await workGenerator.generate();
    await sleep(keyResetDuration.asMilliseconds());
    const data2 = await workGenerator.generate();
    await sleep(keyResetDuration.asMilliseconds());
    const data3 = await workGenerator.generate();

    expect(await workGenerator.verify(data1)).false;
    expect(await workGenerator.verify(data2)).true;
    expect(await workGenerator.verify(data3)).true;
  }

  @test()
  public async verify() {
    const workGenerator = new WorkJwtLocal();
    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
  }

  @test()
  public async verifyFail() {
    const workGenerator = new WorkJwtLocal();
    expect(await workGenerator.verify('')).false;
    expect(await workGenerator.verify('test')).false;

    await workGenerator.resetKey();
    expect(await workGenerator.verify('')).false;
    expect(await workGenerator.verify('test')).false;
  }

  @test()
  public async resetKey() {
    const workGenerator = new WorkJwtLocal();
    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
    await workGenerator.resetKey();
    expect(await workGenerator.verify(data)).false;
  }

  @test()
  public async keyRotationFail() {
    this.sandbox.replace(crypto.subtle, 'generateKey', () => {
      throw new Error();
    });
    const workGenerator = new WorkJwtLocal();
    await expect(workGenerator.generate()).rejectedWith(Error);
    await expect(workGenerator.generate()).rejectedWith(Error);
  }
}
