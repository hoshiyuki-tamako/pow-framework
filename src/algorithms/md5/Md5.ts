import { clamp } from 'lodash';
import md5 from 'md5';

import { Md5Result } from './models';

export type Md5ComplexityRange = 0 | 1 | 2 | 3 | 4 | 5;

export interface Md5Option {
  complexity: Md5ComplexityRange
}

export abstract class Md5 {
  static readonly defaultOption = {
    complexityRange: [0, 1, 2, 3, 4, 5],
    complexity: 0 as Md5ComplexityRange,
  } as const;

  option = {
    complexity: Md5.defaultOption.complexity,
  };

  constructor(option?: Md5Option) {
    this.option.complexity = clamp(
      option?.complexity ?? Md5.defaultOption.complexity,
      Md5.defaultOption.complexityRange[0],
      Md5.defaultOption.complexityRange.at(-1) as Md5ComplexityRange,
    ) as Md5ComplexityRange;
  }

  verify(result: Md5Result, option?: Md5Option) {
    return !!md5(result.data + result.result).match(this.#getRegex(option));
  }

  #getRegex(option?: Md5Option) {
    switch (option?.complexity ?? this.option.complexity) {
      case 5:
        return /^[0-9]{8}/;
      case 4:
        return /^[0-9]{6}/;
      case 3:
        return /^[0-9]{4}/;
      case 2:
        return /^[a-z]{34}/;
      case 1:
        return /^[a-z]{16}/;
      case 0:
      default:
        return /^[a-z]{10}/;
    }
  }
}