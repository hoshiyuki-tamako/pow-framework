import { IPowVerifier } from '../../../src/framework/index';
import { WorkString } from '../../../src/generators/index';
import { PowRequest, PowResult } from '../../../src/framework/model/index';
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