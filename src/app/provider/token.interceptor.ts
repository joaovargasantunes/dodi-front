import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {IMOBILIARIA} from '../utils/common';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly host = IMOBILIARIA();
  private readonly sistema: number = null;

  constructor(
    @Inject('INTERCEPTOR_HOST') interceptorHost: string,
    @Inject('INTERCEPTOR_SISTEMA') interceptorSistema: number,
    private authService: AuthService
  ) {
    if (interceptorHost) {
      this.host = interceptorHost;
    }
    if (interceptorSistema) {
      this.sistema = interceptorSistema;
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.getTokenApi();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${this.getTokenApi()}`
        }
      });
    }

    return next.handle(request);
  }

  private getTokenApi() {
    return this.authService.usuario?.value?.auth_token || null;
  }
}
