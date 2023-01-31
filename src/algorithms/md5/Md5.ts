import { PowResult } from "../../models/index";
import md5 from 'md5';

export class Md5 {
  verify(result: PowResult) {
    // custom condition, can be anything e.g. start with character, charset, hash etc
    return md5(result.data + result.result).startsWith("aa");
  }
}