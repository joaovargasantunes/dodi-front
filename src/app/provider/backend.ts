import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {IMOBILIARIA} from '../utils/common';
import {ApiData, ErrorBackend} from '../interface/type';
import {UtilsService} from '../services/utils.service';

export class BackendDefaults {
  public Ip = null;
  public baseURL = '';
  public url: string = (window.location.host.includes('plenoimob')) ? 'https://' + window.location.host + '/v2' : `http://${window.location.host}`;
  public urlRaiz: string = (window.location.host.includes('plenoimob')) ? 'https://' + window.location.host : `https://${IMOBILIARIA()}`;
  public urlSistema: string = (window.location.host.includes('plenoimob')) ? window.location.host : IMOBILIARIA();
  public urlUploads = `${this.urlRaiz}/uploads/${this.urlSistema}/`;

  constructor(protected http: HttpClient, protected utils: UtilsService) {
  }

  get IP_() {
    return this.Ip;
  }

  getIp() {
    return new Promise((resolve) => {
      let ip = null;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', 'https://api.ipify.org/?format=json');
      xmlhttp.send();
      xmlhttp.onload = function(e) {
        ip = JSON.parse(xmlhttp.response);
        resolve(ip.ip);
      };
    }) as Promise<any>;
  }

  apiGet<T>(endpoint: string, data?): Promise<T> {
    return this.get(endpoint, data);
  }

  apiPost<T>(endpoint: string, data, callbackErr: (error: ErrorBackend) => void = null): Promise<T> {
    return this.post(endpoint, data, callbackErr);
  }

  apiUpdate<T>(endpoint: string, data): Promise<T> {
    return this.update(endpoint, data);
  }

  apiDelete<T>(endpoint: string, data?): Promise<T> {
    return this.delete(endpoint, data);
  }

  apiGetExternal<T>(fullUrl: string, data?): Promise<T> {
    if (data) {
      fullUrl += `?${this.serialize(data, false)}`;
    }

    return this.http
      .get(fullUrl)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  apiPostExternal<T>(fullUrl: string, data, callbackErr: (error: ErrorBackend) => void = null): Promise<T> {
    return this.http
      .post(fullUrl, data)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();

  }

  apiUpdateExternal<T>(fullUrl: string, data): Promise<T> {
    return this.http
      .put(fullUrl, data)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  apiDeleteExternal<T>(fullUrl: string): Promise<T> {
    return this.http
      .delete(fullUrl)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  apiFormDataPost<T>(url: string, form: FormData, callbackErr: (error: ErrorBackend) => void = null): Promise<T> {
    return this.http
      .post(`${this.baseURL}/${url}`, form)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response, null, null, callbackErr)))
      .toPromise();
  }

  protected serialize(obj: any, prefix: any) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        const k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
        str.push((v !== null && typeof v === 'object') ?
          this.serialize(v, k) :
          encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return str.join('&');
  }

  protected get<T>(url: string, data?) {
    if (data) {
      url += `?${this.serialize(data, false)}`;
    }

    return this.http
      .get(`${this.baseURL}/${url}`)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  protected post<T>(url: string, params: any, callbackErr: (error: ErrorBackend) => void = null) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.limparDados(params);
    return this.http
      .post(`${this.baseURL}/${url}`, this.serialize(params, false), options)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response, null, null, callbackErr)))
      .toPromise();
  }

  protected update<T>(url: string, params: any) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.limparDados(params);
    return this.http
      .put(`${this.baseURL}/${url}`, this.serialize(params, false), options)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  protected delete<T>(url: string, params?: any) {
    if (params) {
      url += `?${this.serialize(params, false)}`;
    }

    return this.http
      .delete(`${this.baseURL}/${url}`)
      .pipe(map((response: ApiData<T>) => this.tratarRetorno<T>(response)))
      .toPromise();
  }

  protected tratarRetorno<T>(response: ApiData<T>, title: string = null, text: string = null, callbackErr: (error: ErrorBackend) => void = null) {
    const defaults = {
      title: 'Ooops!',
      text: 'Ocorreu um erro na comunicação com o servidor, tente novamente em alguns instantes.'
    };

    if (response.success) {
      return response.data;
    } else {
      if (response.error.code === 6969) {
        window.location.href = `${this.url}/pendenciaFinanceira`;
      }

      this.utils.carregandoGeral(false);
      this.utils.carregando(false);

      // Somente mostra o erro caso não tiver callback
      if (callbackErr) {
        callbackErr(response.error);
      }

      if (response?.error?.message) {
        defaults.text += `<br><br><small><strong>${response.error.message}</strong></small>`;
      }

      if (response.error.validation) {
        defaults.text += '<br>';
        for (const key in response.error.validation) {
          const validation = response.error.validation[key];
          defaults.text += `<br><small><strong>${validation[0]}</strong></small>`;
        }
      }

      this.utils.mostrarErro({title: title || defaults.title, text: response.error.message || text || defaults.text});
      throw (response.error);
    }
  }

  protected limparDados(objeto) {
    for (const propriedade in objeto) {
      if (objeto[propriedade] === undefined || objeto[propriedade] === null) {
        objeto[propriedade] = '';
      } else if (objeto[propriedade] === false || objeto[propriedade] === 'false') {
        objeto[propriedade] = 0;
      } else if (objeto[propriedade] === true || objeto[propriedade] === 'true') {
        objeto[propriedade] = 1;
      } else if (typeof objeto[propriedade] === 'object') {
        this.limparDados(objeto[propriedade]);
      }
    }
  }
}
