import { Argon2BrowserHashOptions, hash } from 'argon2-browser';

import { IPowWorker, IStrategy } from '../../framework';
import { Forever } from './../../strategies';
import { Argon2 } from './Argon2';
import { Argon2Request, Argon2Result } from './models';

export interface Argon2WorkerOption {
  strategy?: IStrategy;
}

export class Argon2Worker extends Argon2 implements IPowWorker {
  static readonly defaultOption = {
    ...Argon2.defaultOption,
    strategy: Forever,
  };

  #strategy: IStrategy = new Argon2Worker.defaultOption.strategy();

  constructor(option?: Argon2WorkerOption) {
    super();
    this.#strategy = option?.strategy ?? new Argon2Worker.defaultOption.strategy();
  }

  work(request: Argon2Request) {
    const result = new Argon2Result(request.data, "");
    return this.#strategy.run(async () => {
      const { encoded } = await hash({
        ...Argon2Worker.defaultOption.argon2,
        pass: request.data,
        type: request.option.argon2.type,
      } as Argon2BrowserHashOptions);
      result.result = encoded;
      if (this.verifyStructure(result, request.option)) {
        return result;
      }
    });
  }
}
