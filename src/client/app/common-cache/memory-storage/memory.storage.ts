import { Injectable } from '@angular/core';
import { GenericStorage } from '../generic.storage';
import { MemoryStorageImpl } from './memory.storage.impl';

@Injectable()
export class MemoryStorage extends GenericStorage {
  constructor() {
    super(new MemoryStorageImpl);
  }
}
