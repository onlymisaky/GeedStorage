import type { ValueType } from './types';

interface Options {
  expires?: number
}

export class StorageValue<T> {
  value!: T;

  type!: ValueType;

  expires?: number;

  update!: number;

  constructor(value: T, options: Options) {
    this.value = value;
    this.type = typeof value;
    if (Number.isNaN((Number(options.expires)))) {
      this.expires = undefined;
    }
    else {
      this.expires = Math.max(Number(options.expires), 1000 * 30);
    }
    this.update = Date.now();
  }
}
