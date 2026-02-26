import { ValueType } from "./types";

interface Options {
  type: ValueType;
  expires: number | 'infinity';
}

export class StorageValue<T> {
  value!: T;

  type!: ValueType;

  expires: number | 'infinity';

  update!: number;

  constructor(value: T, options: Options) {
    this.value = value;
    this.type = options.type;
    this.expires = options.expires;
    this.update = Date.now();
  }
}
