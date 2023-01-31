import { hash } from 'argon2-browser';
import crypto from 'crypto';

import { Forever } from '../../conditions';
import { ConditionRunner, ICondition, IPowWorker } from '../../framework';
import { Argon2 } from './Argon2';
import { Argon2Request, Argon2Result } from './models';

export interface Argon2WorkerOption {
  conditions?: ICondition[];
}

export class Argon2Worker extends Argon2 implements IPowWorker {
  static readonly defaultOption = {
    ...Argon2.defaultOption,
    condition: Forever,
  };

  #conditions = [] as ICondition[];

  constructor(option?: Argon2WorkerOption) {
    super();
    if (option?.conditions?.length) {
      this.#conditions.push(...option.conditions);
    } else {
      this.#conditions.push(new Argon2Worker.defaultOption.condition());
    }
  }

  work(request: Argon2Request) {
    const result = new Argon2Result(request.data, "");
    return ConditionRunner.chain(...this.#conditions).run(async () => {
      const { encoded } = await hash({
        ...Argon2Worker.defaultOption.argon2,
        pass: request.data,
        type: request.option.argon2.type,
        salt: crypto.getRandomValues(new Uint8Array(16)),
      });
      result.result = encoded;
      if (this.verifyStructure(result, request.option)) {
        return result;
      }
    });
  }
}
