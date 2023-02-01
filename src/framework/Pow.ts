import { IWorkGenerator } from './generator';

export interface IPowOption<TWorkGenerator extends IWorkGenerator = IWorkGenerator> {
  workGenerator: TWorkGenerator
}