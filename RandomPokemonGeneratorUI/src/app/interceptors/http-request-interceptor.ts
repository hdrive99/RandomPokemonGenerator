import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (req.method !== 'GET') {
    return next.handle(req);
    // }

    // var clonedRequest: HttpRequest<unknown>;
    // var modifiedDate = this.localStorageService.getItem('Last-Modified ' + req.url);
    // console.log('req.url', req.url);
    // console.log('modifiedDate', modifiedDate);

    // if (modifiedDate) {
    //   clonedRequest = req.clone({ headers: req.headers.append('If-Modified-Since', this.localStorageService.getItem('Last-Modified ' + req.url)) });
    //   return next.handle(clonedRequest);
    // } else {
    //   return next.handle(req);
    // }
  }
}
