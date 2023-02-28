import { Injectable } from '@angular/core';
import { LocalStorageRefService } from './local-storage-ref.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _localStorage: Storage;

  constructor(
    private _localStorageRefService: LocalStorageRefService
  ) {
    this._localStorage = _localStorageRefService.localStorage;
  }

  setItem(key: string, data: any) {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem(key, jsonData);
  }

  getItem(key: string): any {
    if (this._localStorage.getItem(key)) {
      return JSON.parse(this._localStorage.getItem(key));
    } else {
      return null;
    }
  }

  clearItem(key: string) {
    this._localStorage.removeItem(key);
  }

  clearAllLocalStorage() {
    this._localStorage.clear();
  }
}
