import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { jwtVerify, SignJWT } from 'jose';
import ms from 'ms';
import sleep from 'sleep-promise';

import { BaseTest } from '../Base.test';
import { WorkJwt } from './../../src';

@suite()
export class WorkJwtTest extends BaseTest {
  @test()
  option() {
    const privateKey = "test1";
    const publicKey = "test2";
    const alg = "HS512";
    const expirationTime = "2m";
    const workGenerator = new WorkJwt({
      privateKey,
      publicKey,
      alg,
      expirationTime,
    });
    expect(workGenerator.expirationTime).eq(expirationTime);
  }

  @test()
  async noOption() {
    const workGenerator = new WorkJwt();
    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
  }


  @test()
  async emptyPrivateKey() {
    const workGenerator = new WorkJwt({ privateKey: "" });
    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
  }

  @test()
  async emptyPublicKey() {
    const workGenerator = new WorkJwt({ privateKey: "abc" });
    workGenerator.publicKey = undefined;
    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
  }

  @test()
  async expirationTime() {
    const workGenerator = new WorkJwt({
      privateKey: "secret1",
      expirationTime: "1s",
    });
    const data1 = await workGenerator.generate();
    expect(await workGenerator.verify(data1)).true;

    const data2 = await workGenerator.generate();
    await sleep(ms("2s"));
    expect(await workGenerator.verify(data2)).false;
  }

  @test()
  async privateKeyString() {
    const workGenerator = new WorkJwt({
      privateKey: "123",
    });
    const data1 = await workGenerator.generate();
    expect(await workGenerator.verify(data1)).true;

    workGenerator.privateKey = "test";
    const data2 = await workGenerator.generate();
    expect(await workGenerator.verify(data2)).true;
  }

  @test()
  async publicKeyString() {
    const workGenerator = new WorkJwt({
      privateKey: "123",
      publicKey: "abc",
    });
    const data1 = await workGenerator.generate();
    expect(await workGenerator.verify(data1)).false;

    workGenerator.publicKey = "123";
    const data2 = await workGenerator.generate();
    expect(await workGenerator.verify(data2)).true;
  }

  @test()
  async generate() {
    const privateKey = new TextEncoder().encode("secret");
    const workGenerator = new WorkJwt({
      privateKey,
    });

    const data = await workGenerator.generate();
    const { payload } = await jwtVerify(data, privateKey);
    expect(!!payload).true;
  }

  @test()
  async verify() {
    const privateKey = new TextEncoder().encode("secret");
    const alg = "HS256";
    const workGenerator = new WorkJwt({
      privateKey,
      alg,
    });
    const data = await new SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("1m")
      .sign(privateKey);
    expect(await workGenerator.verify(data)).true;
  }

  @test()
  async verifyFail() {
    const workGenerator = new WorkJwt({
      privateKey: "123",
    });
    expect(await workGenerator.verify("")).false;
    expect(await workGenerator.verify("abc")).false;
  }

  @test()
  async verifyDifferentSecret() {
    const workGenerator1 = new WorkJwt({
      privateKey: "secret1",
    });
    const data1 = await workGenerator1.generate();
    const workGenerator2 = new WorkJwt({
      privateKey: "secret2",
    });
    expect(await workGenerator1.verify(data1)).true;
    expect(await workGenerator2.verify(data1)).false;
  }

  @test()
  async generateVerify() {
    const workGenerator = new WorkJwt({
      privateKey: "test",
    });

    const data = await workGenerator.generate();
    expect(await workGenerator.verify(data)).true;
  }
}
