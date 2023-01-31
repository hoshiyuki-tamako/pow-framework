import { IWorkGenerator } from '../framework';

export class WorkEmpty implements IWorkGenerator {
  generate() {
    return "";
  }

  verify(data: string) {
    return !data;
  }
}