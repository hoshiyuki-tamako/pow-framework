import crypto from 'crypto';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { jwtVerify } from 'jose';

import { AlgAsymmetricTypes, WorkJwt, WorkJwtMetaOption } from './WorkJwt';

dayjs.extend(duration);

export interface WorkJwtLocalOption extends WorkJwtMetaOption {
  alg?: AlgAsymmetricTypes;
  keyResetDuration?: duration.Duration;
}

export class WorkJwtLocal extends WorkJwt {
  static readonly defaultOption = {
    ...WorkJwt.defaultOption,
    alg: "ES512" as AlgAsymmetricTypes,
    keyResetDuration: dayjs.duration({ days: 1 }),
  };

  #oldKeyPair?: CryptoKeyPair;
  #newKeyPair!: CryptoKeyPair;
  set newKeyPair(value: CryptoKeyPair) {
    this.#newKeyPair = value;
    this.privateKey = value.privateKey;
    this.publicKey = value.publicKey;
    this.#keySetAt = dayjs();
  }

  #keySetAt = dayjs();
  #keyResetDuration = WorkJwtLocal.defaultOption.keyResetDuration;

  #isInitialize = false;

  constructor(option?: WorkJwtLocalOption) {
    super({
      ...option,
      alg: option?.alg || WorkJwtLocal.defaultOption.alg,
      privateKey: "",
    });

    this.#keyResetDuration = option?.keyResetDuration ?? WorkJwtLocal.defaultOption.keyResetDuration;
  }

  async #initialize() {
    if (!this.#isInitialize) {
      this.#isInitialize = true;
      try {
        await this.#keyRotation();
      } catch (e) {
        this.#isInitialize = false;
        throw e;
      }
    }
  }

  async generate() {
    await this.#initialize();

    if (dayjs().diff(this.#keySetAt.add(this.#keyResetDuration)) > 0) {
      await this.#keyRotation();
    }

    return super.generate();
  }

  async verify(data: string) {
    await this.#initialize();
    if (await super.verify(data)) {
      return true;
    }

    if (!this.#oldKeyPair) {
      return false;
    }

    try {
      await jwtVerify(data, this.#oldKeyPair.publicKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  async #keyRotation() {
    const key = await crypto.subtle.generateKey({
      name: 'ECDSA',
      namedCurve: 'P-521'
    }, true, ['sign', 'verify']);

    this.#oldKeyPair = this.#newKeyPair;
    this.newKeyPair = key;
  }

  async resetKey() {
    await this.#keyRotation();
    this.#oldKeyPair = undefined;
  }
}
