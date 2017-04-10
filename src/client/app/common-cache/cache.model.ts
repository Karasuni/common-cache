import { Observable } from 'rxjs/Observable';

export interface Cache {
  get<T>(key : string): Observable<T>;
  getOrCreate<T>(key : string, fetcher: () => Observable<T>) : Observable<T>;
  put(key : string, value : any) : void;
  clear() : void;

  updateChecksum(serverModelChecksum : number) : void;
}
