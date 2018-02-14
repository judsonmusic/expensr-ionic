import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/do';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next?: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = null;
    if(sessionStorage.getItem('jwt')){
    authReq = req.clone({
      headers: req.headers.set('x-access-token', sessionStorage.getItem('jwt'))
    });
   } else{
    authReq = req.clone({});
   }
 
   return next.handle(authReq).do((event: HttpEvent<any>) => {
    if(event instanceof HttpResponse){
      //do something with the response.
    }    
    
  }, (err: any) => {    
     if (err instanceof HttpErrorResponse) {
      if (err.status === 401 || err.status === 403) {
        if(window.location.hash.substr(2) !== "home"){
          sessionStorage.clear();
          window.location.href='';            
        }
      }
    } 
  });
  } 

}
