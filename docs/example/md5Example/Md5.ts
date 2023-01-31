import md5 from 'md5';

import { PowResult } from '../../../src/framework/model/index';

export class Md5 {
  verify(result: PowResult) {
    return !!md5(result.data + result.result).match(/^[a-z]{12}/);
  }
}