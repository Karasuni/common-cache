import { async, TestBed } from '@angular/core/testing';

import { Cache } from '../cache.model';
import { MemoryStorage } from './memory.storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import Spy = jasmine.Spy;

export function main() {
  describe('Memory Storage', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        providers: [
          MemoryStorage
        ]
      });
    });

    it('should store and retrieve a value', () => {
      let memoryStorage : MemoryStorage = TestBed.get(MemoryStorage);
      const value = 'data';
      memoryStorage.put('key', value);
      memoryStorage.get('key').subscribe((res) => {
        expect(res).toEqual(value);
      });
    });

    it('should store and retrieve a value using getOrCreate', async(() => {
      let memoryStorage : MemoryStorage = TestBed.get(MemoryStorage);
      const value = 'data'; const key = 'key';

      const spy = {
        fetcher: <Spy>(() => Observable.of(value))
      }; spyOn(spy, 'fetcher').and.callThrough();

      memoryStorage.get(key)
          .do(res => expect(res).toBeNull())      // Value doesn't exist initially
        .flatMap(() => memoryStorage.getOrCreate(key, spy.fetcher))
          .do(()  => expect(spy.fetcher.calls.count()).toEqual(1))
          .do(res => expect(res).toEqual(value))  // Value is created during getOrCreate
        .flatMap(() => memoryStorage.getOrCreate(key, spy.fetcher))
          .do(()  => expect(spy.fetcher.calls.count()).toEqual(1))
          .do(res => expect(res).toEqual(value))  // Second getOrCreate doesn't call fetcher
        .flatMap(() => memoryStorage.get(key))
          .do(res => expect(res).toEqual(value))  // Value is in fact stored
        .subscribe();
    }));

    xit('should cache a getOrCreate request', async(() => {
      let memoryStorage : MemoryStorage = TestBed.get(MemoryStorage);
      const value = 'data'; const key = 'key';

      const spy = {
        fetcher: <Spy>(() => Observable.of(value))
      }; spyOn(spy, 'fetcher').and.callThrough();

      memoryStorage
        .getOrCreate(key, spy.fetcher)
          /*
           * Issue between jasmine done() and angular async:
           *   Jasmine ends early and doesn't complete anything after delay
           *   https://github.com/angular/angular/issues/15830
           */
          .do(()  => console.log('PRE-DELAY'))
          .delay(200)
          .do(()  => console.log('SPY1', spy.fetcher.calls.count()) || expect(spy.fetcher.calls.count()).toEqual(1))
          .do(res => console.log('DONE1', res) || expect(res).toEqual(value))
          .subscribe();

      memoryStorage
        .getOrCreate(key, spy.fetcher)
          .do(()  => console.log('SPY2', spy.fetcher.calls.count()) || expect(spy.fetcher.calls.count()).toEqual(1))
          .do(res => console.log('DONE2', res) || expect(res).toEqual(value))
          .subscribe();

    }));

    it('should clear the cache upon clear', async(() => {
      let storage : Cache = TestBed.get(MemoryStorage);
      const value = 'data'; const key = 'key';

      // WARN: put/clear could execute async - should use callbacks

      storage.put(key, value);
      storage.clear();
      storage.get(key).subscribe((res) => expect(res).toBeNull());
    }));

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

  });
}
