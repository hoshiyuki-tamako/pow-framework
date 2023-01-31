import { IWorkGenerator } from '../framework';

export class WorkString implements IWorkGenerator {
  generate() {
    return Math.random().toString(36).slice(2);
  }

  verify(data: string) {
    return !!data;
  }
}