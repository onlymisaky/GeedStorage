import type { IStorage, StorageMode } from './types';
import { StorageValue } from './StorageValue';

class GeedStorage implements IStorage {
  private storageMode!: StorageMode;

  private prefix = 'Geed_';

  private storage!: Storage;

  private memoryStorage!: Map<string, StorageValue<any>>;

  constructor(options: { mode?: StorageMode, prefix?: string } = { mode: 'memory', prefix: 'Geed_' }) {
    this.storageMode = options.mode || 'memory';
    this.prefix = options.prefix || 'Geed_';
    if (this.storageMode === 'memory' || !window.sessionStorage || !window.localStorage) {
      this.memoryStorage = new Map();
    }
    else {
      this.storage = this.storageMode === 'sessionStorage' ? window.sessionStorage : window.localStorage;
    }
  }

  get length() {
    return this.keys().length;
  }

  set<T>(key: string, value: T, options?: { expires?: number }) {
    if (this.storageMode === 'memory') {
      const val = new StorageValue(value, {
        expires: options?.expires,
      });
      this.memoryStorage.set(key, val);
      return this;
    }

    const val = this.serialize(value, options?.expires);
    this.storage.setItem(`${this.prefix}${key}`, val);
    return this;
  }

  get<T>(key: string): T | undefined {
    if (!this.has(key)) {
      return void 0;
    }

    if (this.storageMode === 'memory') {
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
    if (this.storageMode === 'memory') {
      this.memoryStorage.delete(key);
      return true;
    }

    this.storage.removeItem(`${this.prefix}${key}`);
    return true;
  }

  clear() {
    if (this.storageMode === 'memory') {
      this.memoryStorage.clear();
      return this;
    }

    const keys = this.keys();
    keys.forEach((key) => {
      this.remove(key);
    });
    return this;
  }

  has(key: string) {
    if (this.storageMode === 'memory') {
      return this.memoryStorage.has(key);
    }

    return Object.hasOwn(this.storage, `${this.prefix}${key}`);
  }

  keys() {
    if (this.storageMode === 'memory') {
      return Array.from(this.memoryStorage.keys());
    }

    const keys = [];
    for (const key in this.storage) {
      if (Object.hasOwn(this.storage, key)) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    }
    return keys;
  }

  /**
   * @deprecated Use clear() instead
   */
  clearAll() {
    return this.clear();
  }

  private serialize(value: any, expires?: number): string {
    const type = typeof value;
    let val: any;
    if (['bigint', 'symbol', 'function'].includes(type)) {
      val = new StorageValue('', { expires });
    }
    else {
      val = new StorageValue(value, { expires });
    }
    return JSON.stringify(val);
  }

  private isExpired(update: number, expires?: any): boolean {
    if (expires === undefined) {
      return false;
    }

    const expireDate = Number(expires);
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
