import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Usuario} from '../interface/type';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private usuario$ = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('usuario')) || null);

  constructor(
    public http: HttpClient
  ) {
  }

  public get usuario() {
    return this.usuario$;
  }

  async atualizarUsuario(v: Usuario) {
    v.timestamp = moment().add(1, 'year').format('x');
    localStorage.setItem('usuario', JSON.stringify(v));

    this.usuario$.next(v);
    return v;
  }

  async logout() {
    localStorage.clear();
    return true;
  }

  public get isLoggedIn() {
    const timestamp = moment().format('x');
    return this.usuario$.value?.usu_codigo && (this.usuario$.value?.timestamp >= timestamp);
  }
}
