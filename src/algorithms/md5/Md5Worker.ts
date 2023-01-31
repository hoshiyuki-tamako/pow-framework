import { PowResult } from './../../models/PowResult';
import { IPowWorker } from './../../framework';
import { PowRequest } from './../../models';
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
