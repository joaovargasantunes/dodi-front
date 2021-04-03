import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private loadingGeral$ = new BehaviorSubject<boolean>(false);
  private loadingGeralMsg$ = new BehaviorSubject<string>('Carregando');
  private loading$ = new BehaviorSubject<boolean>(false);
  private erro$ = new Subject<SweetAlertOptions>();

  constructor() { }

  get loadingGeral() {
    return this.loadingGeral$;
  }

  get loadingGeralMsg(){
    return this.loadingGeralMsg$;
  }

  carregandoGeral(carregando: boolean, msg = 'Carregando ...') {
    if (carregando)
      document.body.style.cursor = 'progress';
    else
      document.body.style.cursor = '';

    this.loadingGeralMsg$.next(msg);
    this.loadingGeral$.next(carregando);
  }

  get loading() {
    return this.loading$;
  }

  carregando(carregando: boolean) {
    this.loading$.next(carregando);
  }

  get erro() {
    return this.erro$.asObservable();
  }

  mostrarErro(erro: SweetAlertOptions) {
    this.erro$.next(erro);
  }

  limparErro() {
    this.erro$.next(null);
  }
}
