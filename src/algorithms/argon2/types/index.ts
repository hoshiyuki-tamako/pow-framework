import { ArgonType } from 'argon2-browser';

import { ComplexityOption } from '../../../framework';

export interface Argon2Option extends ComplexityOption {
  argon2: {
    type: ArgonType;
  }
}