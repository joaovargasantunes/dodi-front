import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {UtilsService} from '../services/utils.service';
import {BackendDefaults} from './backend';

@Injectable({
  providedIn: 'root'
})
export class BackendService extends BackendDefaults {
  public url: string = (window.location.host.includes('plenoimob')) ? 'https://' + window.location.host + '/areacliente/v2' : `http://${window.location.host}`;

  constructor(
    @Inject('INTERCEPTOR_HOST') interceptorHost: string,
    public http: HttpClient,
    protected utils: UtilsService,
    protected authService: AuthService
  ) {
    super(http, utils);
    this.urlSistema = interceptorHost;

    this.baseURL = (window.location.host.includes('plenoimob')) ? 'https://api.plenoimob.com.br/api/areacliente' : `http://127.0.0.1:8000/api/areacliente`;
    // this.baseURL = 'https://api.plenoimob.com.br/api/areacliente';

    (async () => {
      this.Ip = await this.getIp();
    })();
  }
}
