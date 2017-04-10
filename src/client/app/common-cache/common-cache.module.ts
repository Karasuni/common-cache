import { NgModule, ModuleWithProviders } from '@angular/core';

import { MemoryStorage } from './memory-storage/memory.storage';
import { SessionStorage } from './session-storage/session.storage';
import { LocalStorage } from './local-storage/local.storage';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class CommonCacheModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonCacheModule,
      providers: [MemoryStorage, SessionStorage, LocalStorage]
    };
  }
}
