import { ArgonType } from 'argon2-browser';

export interface Argon2Option {
  complexity: 0 | 1;
  argon2: {
    type: ArgonType;
  }
}