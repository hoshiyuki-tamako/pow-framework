import { ArgonType, verify } from 'argon2-browser';
import { clamp } from 'lodash';

import { Argon2Result } from './models/Argon2Result';
import { Argon2Option } from './types';

export type Argon2ComplexityRange = 0 | 1;

export abstract class Argon2 {
  static readonly defaultOption = {
    complexityRange: [0, 1] as [number, number],
    complexity: 1 as Argon2ComplexityRange,
    argon2: {
      type: ArgonType.Argon2id,
      mem: 1024,
      time: 2,
      parallelism: 1,
      hashLen: 8,
    },
  };

  option = {
    complexity: Argon2.defaultOption.complexity,
    argon2: {
      type: Argon2.defaultOption.argon2.type,
    }
  } as Argon2Option;

  constructor(option?: Partial<Argon2Option>) {
    this.option.complexity = clamp(
      option?.complexity ?? Argon2.defaultOption.complexity,
      ...Argon2.defaultOption.complexityRange,
    ) as Argon2ComplexityRange;
    this.option.argon2.type = option?.argon2?.type ?? Argon2.defaultOption.argon2.type;
  }

  async verify(result: Argon2Result, option?: Partial<Argon2Option>) {
    if (!this.verifyStructure(result)) {
      return false;
    }

    try {
      await verify({
        pass: result.data,
        encoded: result.result,
        type: option?.argon2?.type ?? this.option.argon2.type,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  verifyStructure(result: Argon2Result, option?: Partial<Argon2Option>) {
    return !!result.result.match(this.#getRegex(option));
  }

  #getRegex(option?: Partial<Argon2Option>) {
    const typeName = (() => {
      switch (option?.argon2?.type ?? this.option.argon2.type) {
        case ArgonType.Argon2d:
          return "argon2d";
        case ArgonType.Argon2i:
          return "argon2i";
        case ArgonType.Argon2id:
        default:
          return "argon2id";
      }
    })();

    const base = `^\\$${typeName}(\\$[\\w,=]+){3}\\$`;
    switch (option?.complexity ?? this.option.complexity) {
      case 0:
        return new RegExp(`${base}[a-z]{4}`, 'g');
      case 1:
      default:
        return new RegExp(`${base}[a-z]{5}`, 'g');
    }
  }

}
