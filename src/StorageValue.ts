export class StorageValue<T> {
  value!: T;
  type!: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
  expires: number | 'infinity';
  update!: number;

  constructor(value: T, options: Options) {
    this.value = value;
    this.type = options.type;
    this.expires = options.expires;
    this.update = Date.now();
  }
}
