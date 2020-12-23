# GeedStorage

支持 `json` 的本地存储。

## Features
- 支持存储和读取 `string`、`numer`、`object`、`boolean`、`undefined`
- 支持设置存储key的前辍
- 支持设置过期时间
- 友好的类型提示

## API
```typescript
const storage = new GeedStorage({
  type: 'local',    // local | session
  prefix: 'Geed_',  // 默人为 Geed_
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
storage.get<{ name: string; age: number; }>('user'); // { name: 'qq', age: 18 }

/** remove */

storage.remove('busy'); // remove busy

storage.clearAll(); // clear all keys
```
