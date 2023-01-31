import { PowResult } from '../../../src/framework/model/PowResult';
import { IPowWorker } from '../../../src/framework/index';
import { PowRequest } from '../../../src/framework/model/index';
import { Md5 } from './Md5';

export class Md5Worker extends Md5 implements IPowWorker {
  work(request: PowRequest) {
    const result = new PowResult(request.data, "");
    do {
      result.result = this.#randomString();
    } while (!this.verify(result));
    return result;
  }

  #randomString() {
    return Math.random().toString(36).slice(2);
  }
}
