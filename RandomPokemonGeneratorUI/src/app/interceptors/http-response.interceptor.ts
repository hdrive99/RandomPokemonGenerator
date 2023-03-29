import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (req.method !== 'GET') {
    return next.handle(req);
    // }

    // return next.handle(req).pipe(
    //   filter(event => event instanceof HttpResponse),
    //   tap((event: HttpResponse<any>) => {
    //     this.localStorageService.setItem('Last-Modified ' + event.url, event.headers.get('Last-Modified'));
    //   })
    // )
  }
}
