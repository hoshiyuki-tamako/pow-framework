import { IPowOption, IPowVerifier, IWorkGenerator, PowRequest, PowResult } from '../../framework';
import { Md5 } from './Md5';

export class Md5Verifier extends Md5 implements IPowVerifier, IPowOption {
  workGenerator: IWorkGenerator;

  constructor(option: IPowOption) {
    super();
    this.workGenerator = option.workGenerator;
  }

  async generate() {
    return new PowRequest(await this.workGenerator.generate());
  }

  async verify(result: PowResult) {
    return await super.verify(result) && await this.workGenerator.verify(result.data);
  }
}