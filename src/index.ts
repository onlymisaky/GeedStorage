type Options = {
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
  expires: number | 'infinity';
};

class StorageValue<T> {
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

class GeedStorage {

  private type!: 'session' | 'local';
  private prefix = 'Geed_';
  private storage!: Storage;

  constructor(options: { type?: 'session' | 'local'; prefix?: string; } = { type: 'session', prefix: 'Geed_' }) {
    this.type = options.type || 'session';
    this.prefix = options.prefix || 'Geed_';
    this.storage = this.type === 'session' ? sessionStorage : localStorage;
  }

  set<T>(key: string, value: T, options?: { expires?: number; }) {
    const val = this.serialize(value, options?.expires as number);
    return this.storage.setItem(`${this.prefix}${key}`, val);
  }
  get<T>(key: string): T | null {
    let storageValue;
    storageValue = this.storage.getItem(`${this.prefix}${key}`);
    if (storageValue) {
      storageValue = JSON.parse(storageValue) as StorageValue<T>;
      let { expires, type, value, update } = storageValue;
      const isExpired = this.isExpired(update, expires);
      if (isExpired) {
        this.remove(key);
        return null;
      }
      switch (type) {
        case 'number':
          value = Number(value) as unknown as T;
          break;
        case 'undefined':
          value = undefined as unknown as T;
          break;
        case 'boolean':
          if (value as unknown as string === 'false') {
            value = false as unknown as T;
          } else if (value as unknown as string === 'true') {
            value = true as unknown as T;
          } else {
            value = Boolean(value) as unknown as T;
          }
          break;
        case 'string':
          value = `${value}` as unknown as T;
          break;
        default:
          break;
      }
      return value;
    }
    return null;
  }
  remove(key: string) {
    return this.storage.removeItem(`${this.prefix}${key}`)
  }
  clearAll() {
    return this.storage.clear();
  }

  private serialize(value: any, expires: number | 'infinity'): string {
    const type = typeof value;
    let val: any;
    if (['bigint', 'symbol', 'function'].includes(type)) {
      val = new StorageValue('', { type, expires })
    }
    else {
      val = new StorageValue(value, { type, expires })
    }
    return JSON.stringify(val);
  }

  private isExpired(update: number, expires: any): boolean {
    const expireDate = parseInt(expires, 10);
    if (isNaN(expireDate)) {
      return false;
    }
    const now = Date.now();
    if (now > update + expireDate) {
      return true;
    }
    return false;
  }

}

export { GeedStorage };

export default GeedStorage;
