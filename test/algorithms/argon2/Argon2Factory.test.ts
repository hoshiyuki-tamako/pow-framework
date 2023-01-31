import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { Argon2VerifierWithJwt, Argon2VerifierWithJwtLocal, WorkJwt, WorkJwtLocal } from '../../../src';
import { BaseTest } from '../../Base.test';

@suite()
export class Argon2FactoryTest extends BaseTest {
  @test()
  jwt() {
    const privateKey = "test1";
    const publicKey = "test2";
    const alg = "HS512";
    const expirationTime = "2m";
    const verifier = new Argon2VerifierWithJwt({
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
    const verifier = new Argon2VerifierWithJwtLocal({
      alg,
      expirationTime
    });
    const workGenerator = verifier.workGenerator as WorkJwtLocal;
    expect(workGenerator.constructor).eq(WorkJwtLocal);
    expect(workGenerator.expirationTime).eq(expirationTime);
  }
}
