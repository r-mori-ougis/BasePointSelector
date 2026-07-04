import { APP } from './utils.js';
export class StorageService {
  constructor() { this.db = null; }
  open() { return new Promise((resolve, reject) => { const request = indexedDB.open(APP.dbName, APP.dbVersion); request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' }); if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta'); }; request.onsuccess = () => { this.db = request.result; resolve(); }; request.onerror = () => reject(new Error('IndexedDBを開けません')); }); }
  store(name, mode = 'readonly') { if (!this.db) throw new Error('保存領域が未初期化です'); return this.db.transaction(name, mode).objectStore(name); }
  putProject(project) { return this.request(this.store('projects', 'readwrite').put(project)); }
  getProject(id) { return this.request(this.store('projects').get(id)); }
  listProjects() { return this.request(this.store('projects').getAll()); }
  deleteProject(id) { return this.request(this.store('projects', 'readwrite').delete(id)); }
  putMeta(key, value) { return this.request(this.store('meta', 'readwrite').put(value, key)); }
  getMeta(key) { return this.request(this.store('meta').get(key)); }
  request(req) { return new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(new Error('保存処理に失敗しました')); }); }
}
