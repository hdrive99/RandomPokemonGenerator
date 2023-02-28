import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

function getLocalStorage(): Storage {
  return localStorage;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageRefService {
  get localStorage(): Storage {
    if (isPlatformBrowser(this.platformId)) {
      return getLocalStorage();
    } else {
      throw new Error("Error");
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId
  ) { }
}
