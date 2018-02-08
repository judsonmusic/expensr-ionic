import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = null;
    if(sessionStorage.getItem('jwt')){
    authReq = req.clone({
      headers: req.headers.set('x-access-token', sessionStorage.getItem('jwt'))
    });
   } else{

    authReq = req.clone({});
   }
    return next.handle(authReq);
  }
}
