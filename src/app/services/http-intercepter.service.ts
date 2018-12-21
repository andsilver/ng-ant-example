import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { LoadingHandlerService } from 'app/services/loading-handler.service';
import { environment } from 'environments/environment';

@Injectable()
export class HttpIntercepterService implements HttpInterceptor {

  constructor(
    private loader : LoadingHandlerService,
    private message: NzMessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loader.isLoading = true;
    // Get the auth header from the service.
    const token = localStorage.getItem('token');
    const url = req.url.indexOf(environment.apiUrl) > -1
                ? req.url
                : environment.apiUrl + req.url + '';

    if (!token) {
      const apiReq = req.clone({
        url: url
      });
      return this.handleRequest(next, apiReq);

    } else {
      // Get the auth header from the service.
      const authHeader = 'Bearer ' + token;
      // Clone the request to add the new header.
      const authReq = req.clone({
          setHeaders: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          url: url
      });
      // Pass on the cloned request instead of the original request.
      return this.handleRequest(next, authReq);
    }
  }

  handleRequest(next, req) {
    return next.handle(req)
            .pipe(
              tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                  this.loader.isLoading = false;
                }
              }, (err: any) => {
                console.log(err);
                this.message.error(err.error.msg);
                this.loader.isLoading = false;
              })
            )
  }
}
