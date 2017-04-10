export class MemoryStorageImpl implements Storage {

  length: number;
  remainingSpace: number;
  [key: string]: any;
  [index: number]: string;

  private CACHE : {[key:string]:any} = {};

  clear(): void {
    this.CACHE = {};
  }

  getItem(key: string): any {
    return this.CACHE[key];
  }

  key(index: number): string {
    return Object.keys(this.CACHE)[index];
  }

  removeItem(key: string): void {
    delete this.CACHE[key];
  }

  setItem(key: string, data: string): void {
    this.CACHE[key] = data;
  }

  toString() {
    return this.CACHE;
  }

}
