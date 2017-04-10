import { Injectable } from '@angular/core';
import { GenericStorage } from '../generic.storage';

@Injectable()
export class LocalStorage extends GenericStorage {
  constructor() {
    super(localStorage);
  }

  put(key : string, value : any) {
    this.storage.setItem(this.hash(key), this.hash(value));
  }
}
