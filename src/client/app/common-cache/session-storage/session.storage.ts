import { Injectable } from '@angular/core';
import { GenericStorage } from '../generic.storage';

@Injectable()
export class SessionStorage extends GenericStorage {
  constructor() {
    super(sessionStorage);
  }
}
