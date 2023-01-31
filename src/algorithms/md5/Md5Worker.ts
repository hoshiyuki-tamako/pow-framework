import { IPowWorker } from '../../framework';
import { Md5 } from './Md5';
import { Md5Request, Md5Result } from './models';

export class Md5Worker extends Md5 implements IPowWorker {
  work(request: Md5Request) {
    const result = new Md5Result(request.data, "");
    do {
      result.result = this.#randomString();
    } while (!this.verify(result, request.option));
    return result;
  }

  #randomString() {
    return Math.random().toString(36).slice(2);
  }
}
