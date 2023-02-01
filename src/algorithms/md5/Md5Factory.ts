import { WorkJwt, WorkJwtLocal, WorkJwtLocalOption, WorkJwtOption } from '../../generators';
import { Md5Verifier } from './Md5Verifier';

export class Md5VerifierWithJwtLocal extends Md5Verifier {
  constructor(option?: WorkJwtLocalOption) {
    super({
      workGenerator: new WorkJwtLocal(option),
    });
  }
}

export class Md5VerifierWithJwt extends Md5Verifier {
  constructor(option: WorkJwtOption) {
    super({
      workGenerator: new WorkJwt(option),
    });
  }
}
