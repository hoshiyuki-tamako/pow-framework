import { IWorkGenerator, PowUnsupportedGenerateType } from '../framework';

export interface WorkDateOption {
  type: "string" | "number" | "date";
}

export class WorkDate implements IWorkGenerator<string | number | Date> {
  generate(option?: WorkDateOption) {
    const type = option?.type;
    const data = new Date();
    if (!type || type === "string") {
      return data.toISOString();
    } else if (type === "date") {
      return data;
    } else if (type === "number") {
      return +data;
    } else {
      throw new PowUnsupportedGenerateType();
    }
  }

  verify(data: string | number | Date) {
    return isFinite(+new Date(data));
  }
}