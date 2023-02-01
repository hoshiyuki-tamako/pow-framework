import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Md5VerifierWithJwt, Md5VerifierWithJwtLocal, WorkJwt, WorkJwtLocal } from '../../../src';
import { BaseTest } from '../../Base.test';

@suite()
export class Md5FactoryTest extends BaseTest {
  @test()
  jwt() {
    const privateKey = "test1";
    const publicKey = "test2";
    const alg = "HS512";
    const expirationTime = "2m";
    const verifier = new Md5VerifierWithJwt({
      privateKey,
      publicKey,
      alg,
      expirationTime,
    });
    const workGenerator = verifier.workGenerator as WorkJwt;
    expect(workGenerator.constructor).eq(WorkJwt);
    expect(workGenerator.expirationTime).eq(expirationTime);
  }

  @test()
  jwtLocal() {
    const alg = "ES256";
    const expirationTime = "2m";
    const verifier = new Md5VerifierWithJwtLocal({
      alg,
      expirationTime
    });
    const workGenerator = verifier.workGenerator as WorkJwtLocal;
    expect(workGenerator.constructor).eq(WorkJwtLocal);
    expect(workGenerator.expirationTime).eq(expirationTime);
  }
}
