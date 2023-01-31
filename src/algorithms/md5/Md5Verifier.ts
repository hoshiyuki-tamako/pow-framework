import { cloneDeep } from 'lodash';

import { IPowVerifier } from '../../framework';
import { WorkString } from '../../generators';
import { Md5 } from './Md5';
import { Md5Request, Md5Result } from './models';

export class Md5Verifier extends Md5 implements IPowVerifier {
  workGenerator = new WorkString();

  generate() {
    return new Md5Request(this.workGenerator.generate(), cloneDeep(this.option));
  }

  verify(result: Md5Result) {
    return super.verify(result) && this.workGenerator.verify(result.data);
  }
}