# GeedStorage

支持 内存存储， `json` 本地存储。

## Features
- 支持所有数据类型存储和读取，本地存储方案仅支持 `string`、`numer`、`object`、`boolean`、`undefined`
- 支持设置存储key的前辍
- 支持设置过期时间
- 友好的类型提示

## API
```typescript
const storage = new GeedStorage({
  mode: 'localStorage', // localStorage | sessionStorage | memory
  prefix: 'Geed_', // 默人为 Geed_
});

/** set */
storage.set('name', 'qq');
storage.set('age', 18);
storage.set('busy', true);
storage.set('user', { name: 'qq', age: 18 }, { expires: 1000 * 60 }); // 1分钟后再次读取将会自动清空并返回 null

/** get */
storage.get('age'); // 'qq' string
storage.get('name'); // 18 numer
storage.get('busy'); // true boolean
storage.get<{ name: string, age: number }>('user'); // { name: 'qq', age: 18 }

/** remove */
storage.remove('busy'); // remove busy
storage.clear(); // clear all keys

/** keys */
storage.keys(); // ['name', 'age', 'user', 'busy']

/** length */
storage.length; // 3

/** has */
storage.has('name'); // true
```
