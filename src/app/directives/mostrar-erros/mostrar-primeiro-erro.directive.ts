import { Directive, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[plenoPrimeiroErro]'
})
export class MostrarPrimeiroErroDirective implements AfterViewInit, OnDestroy {
  private campos: { input: any; control: NgControl; y?: number }[] = [];

  public submit = new EventEmitter();

  private onSubmit: Subscription;

  private ordenarCampos$ = new BehaviorSubject([]);
  private ordenarCampos: Subscription;

  constructor() {}

  ngAfterViewInit() {
    this.onSubmit = this.submit.subscribe(() => {
      const invalid = this.campos.filter(c => c.control.invalid);
      this.focarInput(invalid[0] && invalid[0].input);
    });

    /* obtem a posição do input na tela */
    const posicao = i =>
      i && typeof i.getLocationInWindow === 'function' && i.getLocationInWindow();

    /* ordena os campos pela posição y em que eles estão na tela */
    this.ordenarCampos = this.ordenarCampos$.pipe(debounceTime(500)).subscribe(() => {
      this.campos = this.campos
        .map(c => ({ ...c, y: (posicao(c.input) || { y: 0 }).y }))
        .sort((a, b) => a.y - b.y);
    });
  }

  ngOnDestroy() {
    if (this.onSubmit instanceof Subscription) {
      this.onSubmit.unsubscribe();
    }

    if (this.ordenarCampos instanceof Subscription) {
      this.ordenarCampos.unsubscribe();
    }
  }

  registrarInput(input: any, control: NgControl) {
    this.campos = [...this.campos, { input, control }];
    this.ordenarCampos$.next(this.campos);
  }

  irParaProximoCampo(input: any) {
    const index = this.campos.findIndex(v => v.input === input);
    const proximoCampo = this.campos[index + 1];

    if (index !== -1 && proximoCampo) {
      this.focarInput(proximoCampo.input);
    }
  }

  focarInput(input: any) {
    if (input && typeof input.focus === 'function') {
      input.focus();

      if (input.android) {
        // emite evento para garantir que o KeyboardToolbar apareça corretamente
        input.notify({ eventName: 'focus', object: input });
      }
    }
  }
}
