export interface IStorage {
  readonly length: number
  set: <T>(key: string, value: T, options?: { expires?: number }) => this
  get: <T>(key: string) => T | undefined
  remove: (key: string) => boolean
  clear: () => this
  has: (key: string) => boolean
  keys: () => string[]
}

export type StorageMode = 'sessionStorage' | 'localStorage' | 'memory';

export type ValueType = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
