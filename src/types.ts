export interface IStorage {
  readonly length: number
  set: <T>(key: string, value: T, options?: { expires?: number }) => boolean
  get: <T>(key: string) => T | undefined
  remove: (key: string) => boolean
  clear: () => boolean
  has: (key: string) => boolean
  keys: () => string[]
}

export type StorageType = 'session' | 'local' | 'memory';

export type ValueType = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
