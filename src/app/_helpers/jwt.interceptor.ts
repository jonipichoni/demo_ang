import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AlertService } from '../_services/index';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
      private router: Router,
      private alertService: AlertService
     ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        //return next.handle(request);

        return next.handle(request).do((event: HttpEvent<any>) => 
        {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 400) {
              // redirect to the login route
              // or show a modal
              console.log(err);
              var errstr = err.error.error || "Invalid Session";
              this.alertService.error(errstr,true); 
              this.router.navigate(['/login']);

            }
          }
       });
  }
}