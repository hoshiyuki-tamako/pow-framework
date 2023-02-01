import md5 from 'md5';

import { PowResult } from '../../framework';

export abstract class Md5 {
  verify(result: PowResult) {
    return Promise.resolve(!!md5(result.data + result.result).match(/^[a-z]{12}/));
  }
}