import { WorkJwt, WorkJwtLocal, WorkJwtLocalOption, WorkJwtOption } from '../../generators';
import { Argon2Verifier, Argon2VerifierOption } from './Argon2Verifier';

export class Argon2VerifierWithJwtLocal extends Argon2Verifier {
  constructor(option?: Partial<Argon2VerifierOption> & WorkJwtLocalOption) {
    super({
      ...option,
      workGenerator: new WorkJwtLocal(option),
    });
  }
}

export class Argon2VerifierWithJwt extends Argon2Verifier {
  constructor(option: Partial<Argon2VerifierOption> & WorkJwtOption) {
    super({
      ...option,
      workGenerator: new WorkJwt(option),
    });
  }
}
