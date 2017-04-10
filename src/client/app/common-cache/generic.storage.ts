import { Cache } from './cache.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

export class GenericStorage implements Cache {

  protected observableCache : {[key: string] : Observable<any>} = {};

  constructor(protected storage : Storage) {
    if(typeof(Storage) === 'undefined') { console.error('/!\ No Web Storage support..'); }
  }

  /*
   * Returns null if the key does not exist and/or if the value for that key is null
   */
  get<T>(key: string): Observable<T> {
    const lookupKey = this.hash(key);
    const lookupValue = this.storage.getItem(lookupKey);
    const returnValue = (typeof lookupValue !== 'undefined') ? this.unhash(lookupValue) : null;
    return Observable.of(returnValue);
  }

  /*
   * Merge multiple requests while they're active into a single Observable
   *
   * Observable pattern discussed at
   *  http://stackoverflow.com/q/43208903/557552
   */
  getOrCreate<T>(key : string, fetcher: () => Observable<T>) : Observable<T> {
    const keyHash = this.hash(key);

    // Check if an observable for the same key is already in flight
    if (this.observableCache[keyHash]) {
      return this.observableCache[keyHash];
    } else {

      let observable : Observable<T> = this.get(key)
        .flatMap(res => {
          // Cache miss. Retrieving from fetching while creating entry
          if(res === null) {
            return fetcher()
              .do(fetchedResult => this.put(key, fetchedResult));
          // Else cache hit
          } else return Observable.of(res); // Can't we just continue with the original?
        })
        .do({ complete : ()=> {
          // Remove cached observable when done
          delete this.observableCache[this.hash(key)];
        }}).share();

      // Register in-flight observables
      this.observableCache[keyHash] = observable;

      return observable;
    }
  }

  /*
   * Q: Should we be able to detect when this is ready?
   */
  put(key: string, value: any): void {
    this.storage.setItem(this.hash(key), value);
  }

  clear() : void {
    this.storage.clear();
  }

  updateChecksum(serverModelChecksum: number): void {
    // TODO : implement
  }

  /*
   * LocalStorage is preferably readable (strings not stringified)
   * IndexedDB does not need to hash / un-hash values
   * Any object / array should always be hashed
   * JSON.parse fails on non-JSON objects (like normal strings)
   */
  protected hash(key: any): string {
    return typeof key === 'object' ? JSON.stringify(key) : key;
  }

  protected unhash(value: any): any {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
