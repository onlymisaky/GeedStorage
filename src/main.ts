/* eslint-disable no-console */
import GeedStorage from './index';

// 测试 GeedStorage 功能
console.log('Testing GeedStorage...');

// 测试 localStorage 模式
const storage = new GeedStorage({
  type: 'local',
});

// 设置值
storage.set('name', 'GeedStorage');
storage.set('version', '0.0.1');
storage.set('features', ['localStorage', 'sessionStorage', 'memoryCache']);

// 获取值
console.log('name:', storage.get('name'));
console.log('version:', storage.get('version'));
console.log('features:', storage.get('features'));

// 删除值
storage.remove('version');
console.log('After remove version:', storage.get('version'));

// 清空所有值
// storage.clear();

// 测试 sessionStorage 模式
const sessionStorage = new GeedStorage({
  type: 'session',
  prefix: 'session_',
});

sessionStorage.set('user', { id: 1, name: 'Test User' });
console.log('session user:', sessionStorage.get('user'));

// 测试 memoryCache 模式
const memoryStorage = new GeedStorage({
  type: 'memory',
  prefix: 'memory_',
});

memoryStorage.set('temp', 'temporary data');
console.log('memory temp:', memoryStorage.get('temp'));

console.log('GeedStorage test completed!');
