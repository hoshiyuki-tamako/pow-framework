import { cloneDeep } from 'lodash';

import { IPowOption, IPowVerifier, IWorkGenerator } from '../../framework';
import { Argon2 } from './Argon2';
import { Argon2Request, Argon2Result } from './models';
import { Argon2Option } from './types';

export interface Argon2VerifierOption<TWorkGenerator extends IWorkGenerator = IWorkGenerator> extends Partial<Argon2Option> {
  workGenerator: TWorkGenerator;
}

export class Argon2Verifier<TWorkGenerator extends IWorkGenerator = IWorkGenerator> extends Argon2 implements IPowVerifier, IPowOption {
  workGenerator: TWorkGenerator;

  constructor(option: Argon2VerifierOption<TWorkGenerator>) {
    super(option);
    this.workGenerator = option.workGenerator;
  }

  async generate() {
    return new Argon2Request(await this.workGenerator.generate(), cloneDeep(this.option));
  }

  async verify(result: Argon2Result) {
    return await super.verify(result) && await this.workGenerator.verify(result.data);
  }
}
