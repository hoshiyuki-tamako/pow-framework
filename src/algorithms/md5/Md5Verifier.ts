import { PowRequest, PowResult } from '../../models';
import { IPowVerifier } from './../../framework';
import { WorkString } from './../../generators';
import { Md5 } from './Md5';

export class Md5Verifier extends Md5 implements IPowVerifier {
  workGenerator = new WorkString();

  generate() {
    return new PowRequest(this.workGenerator.generate());
  }

  verify(result: PowResult) {
    return super.verify(result) && this.workGenerator.verify(result.data);
  }
}