import type { IStorage, StorageType } from './types';
import { StorageValue } from './StorageValue';

class GeedStorage implements IStorage {
  private type!: StorageType;

  private prefix = 'Geed_';

  private storage!: Storage;

  private memoryStorage!: Map<string, StorageValue<any>>;

  constructor(options: { type?: StorageType, prefix?: string } = { type: 'memory', prefix: 'Geed_' }) {
    this.type = options.type || 'memory';
    this.prefix = options.prefix || 'Geed_';
    if (this.type === 'memory' || !window.sessionStorage || !window.localStorage) {
      this.memoryStorage = new Map();
    }
    else {
      this.storage = this.type === 'session' ? window.sessionStorage : window.localStorage;
    }
  }

  get length() {
    return this.keys().length;
  }

  set<T>(key: string, value: T, options?: { expires?: number }) {
    if (this.type === 'memory') {
      const val = new StorageValue(value, {
        type: typeof value,
        expires: options?.expires || 'infinity',
      });
      this.memoryStorage.set(key, val);
      return true;
    }

    const val = this.serialize(value, options?.expires as number);
    this.storage.setItem(`${this.prefix}${key}`, val);
    return true;
  }

  get<T>(key: string): T | undefined {
    if (!this.has(key)) {
      return void 0;
    }

    if (this.type === 'memory') {
      const val = this.memoryStorage.get(key);
      if (val) {
        const { expires, update } = val;
        const isExpired = this.isExpired(update, expires);
        if (isExpired) {
          this.remove(key);
          return void 0;
        }
        return val.value as T;
      }
    }

    let storageValue;
    storageValue = this.storage.getItem(`${this.prefix}${key}`);
    if (storageValue) {
      storageValue = JSON.parse(storageValue) as StorageValue<T>;
      const { expires, type, update } = storageValue;
      let { value } = storageValue;
      const isExpired = this.isExpired(update, expires);
      if (isExpired) {
        this.remove(key);
        return void 0;
      }
      switch (type) {
        case 'number':
          value = Number(value) as T;
          break;
        case 'undefined':
          value = undefined as T;
          break;
        case 'boolean':
          if (value as string === 'false') {
            value = false as T;
          }
          else if (value as string === 'true') {
            value = true as T;
          }
          else {
            value = Boolean(value) as T;
          }
          break;
        case 'string':
          value = `${value}` as T;
          break;
        default:
          break;
      }
      return value;
    }
    return void 0;
  }

  remove(key: string) {
    if (this.type === 'memory') {
      this.memoryStorage.delete(key);
      return true;
    }

    this.storage.removeItem(`${this.prefix}${key}`);
    return true;
  }

  clear() {
    if (this.type === 'memory') {
      this.memoryStorage.clear();
      return true;
    }

    this.storage.clear();
    return true;
  }

  has(key: string) {
    if (this.type === 'memory') {
      return this.memoryStorage.has(key);
    }

    return Object.keys(this.storage).includes(`${this.prefix}${key}`);
  }

  keys() {
    if (this.type === 'memory') {
      return Array.from(this.memoryStorage.keys());
    }

    return Object.keys(this.storage).reduce((keys, key) => {
      if (key.startsWith(this.prefix)) {
        return [...keys, key.replace(this.prefix, '')];
      }
      return keys;
    }, [] as string[]);
  }

  /**
   * @deprecated Use clear() instead
   */
  clearAll() {
    return this.clear();
  }

  private serialize(value: any, expires: number | 'infinity'): string {
    const type = typeof value;
    let val: any;
    if (['bigint', 'symbol', 'function'].includes(type)) {
      val = new StorageValue('', { type, expires });
    }
    else {
      val = new StorageValue(value, { type, expires });
    }
    return JSON.stringify(val);
  }

  private isExpired(update: number, expires: any): boolean {
    const expireDate = Number.parseInt(expires, 10);
    if (Number.isNaN(expireDate)) {
      return false;
    }
    const now = Date.now();
    if (now > update + expireDate) {
      return true;
    }
    return false;
  }
}

// export { GeedStorage };

export default GeedStorage;
