import { jwtVerify, KeyLike, SignJWT } from 'jose';

import { IWorkGenerator } from '../framework';

export type AlgSymmetricTypes = "HS256" | "HS512";
export type AlgAsymmetricTypes = "ES256" | "ES512";
export type AlgTypes = AlgSymmetricTypes | AlgAsymmetricTypes;

export interface WorkJwtMetaOption {
  expirationTime?: string;
}

export interface WorkJwtOption extends WorkJwtMetaOption {
  /**
   * can be random string
   */
  privateKey?: string | KeyLike | Uint8Array;

  /**
   * will use privateKey if publicKey is empty
  */
  publicKey?: string | KeyLike | Uint8Array;

  alg?: AlgTypes;
}

export class WorkJwt implements IWorkGenerator {
  static readonly defaultOption = {
    alg: "HS256" as AlgTypes,
    expirationTime: '1m',
  };

  static readonly textEncoder = new TextEncoder();

  #privateKey: KeyLike | Uint8Array = new Uint8Array();

  /**
   * update private key will clear public key
   */
  set privateKey(value: string | KeyLike | Uint8Array) {
    this.#privateKey = typeof value === "string" ?
      WorkJwt.textEncoder.encode(value) :
      value;
    this.#publicKey = this.#privateKey;
  }

  #publicKey?: KeyLike | Uint8Array | null;
  set publicKey(value: string | KeyLike | Uint8Array | null | undefined) {
    this.#publicKey = typeof value === "string" ?
      WorkJwt.textEncoder.encode(value) :
      value;
  }

  #alg = WorkJwt.defaultOption.alg;
  expirationTime = WorkJwt.defaultOption.expirationTime;

  constructor(option?: WorkJwtOption) {
    this.privateKey = option?.privateKey ?? "";
    this.publicKey = option?.publicKey ?? option?.privateKey;
    this.#alg = option?.alg || WorkJwt.defaultOption.alg;
    this.expirationTime = option?.expirationTime || WorkJwt.defaultOption.expirationTime;
  }

  generate() {
    return new SignJWT({})
      .setProtectedHeader({ alg: this.#alg })
      .setExpirationTime(this.expirationTime)
      .sign(this.#privateKey);
  }

  async verify(data: string) {
    try {
      await jwtVerify(data, this.#publicKey ?? this.#privateKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
