import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loadSubject = new BehaviorSubject<boolean>(true);
  load$ = this.loadSubject.asObservable();

  private get loading(): boolean {
    return this.loadSubject.getValue();
  }

  private set loading(data: boolean) {
    this.loadSubject.next(data);
  }

  private _lastModified$ = new BehaviorSubject<boolean>(true);
  lastModified$ = this._lastModified$.asObservable();

  public get lastModified(): boolean {
    return this._lastModified$.getValue();
  }

  public set lastModified(data: boolean) {
    this._lastModified$.next(data);
  }

  startSpinner() {
    this.loading = true;
    document.getElementById("loading-overlay").style.display = "block";
  }

  stopSpinner() {
    this.loading = false;
    document.getElementById("loading-overlay").style.display = "none";
  }
}
