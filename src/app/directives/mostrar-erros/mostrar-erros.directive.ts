import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Optional} from '@angular/core';
import {NgControl} from '@angular/forms';
import {combineLatest, fromEvent, merge, of, Subscription} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {MostrarPrimeiroErroDirective} from './mostrar-primeiro-erro.directive';
import {ErrosFormularioService} from '../../services/erros-formulario.service';

import * as $ from 'jquery';

@Directive({
  selector: '[plenoMostrarErros]'
})
export class MostrarErrosDirective implements AfterViewInit, OnDestroy {
  private parent: any;
  private input: any;

  private changes: Subscription;
  private proximoCampo: Subscription;

  @Input() plenoMostrarErros: string;
  @Input() encapsulated: boolean;
  @Input() insideLayer: boolean;
  @Input() isMatField = false;

  constructor(
    private element: ElementRef,
    private mostrarPrimeiroErro: MostrarPrimeiroErroDirective,
    @Optional() private ngControl: NgControl,
    private errosFormulario: ErrosFormularioService
  ) {
  }

  ngAfterViewInit() {
    if (this.plenoMostrarErros === 'submit') {
      this.changes = fromEvent(this.element.nativeElement, 'click').subscribe(() => {
        this.mostrarPrimeiroErro.submit.emit();
      });
    } else {
      this.input = this.element.nativeElement;

      setTimeout(() => (this.input.id = this.ngControl.path.join('-')), 0);

      this.parent = $(this.element.nativeElement).parent();

      if (this.isMatField) {
        this.parent = this.parent.parent().parent();
      } else if (!this.insideLayer) {
        this.parent = this.parent.parent();
      }

      const focus$ = merge(
        of(false),
        fromEvent(this.input, 'focus').pipe(mapTo(true)),
        fromEvent(this.input, 'blur').pipe(mapTo(false)),
        fromEvent(this.input, 'returnPress').pipe(mapTo(false))
      );

      this.proximoCampo = fromEvent(this.input, 'returnPress').subscribe(() =>
        this.mostrarPrimeiroErro.irParaProximoCampo(this.input)
      );

      const status$ = merge(
        fromEvent(this.input, 'blur'),
        this.ngControl.statusChanges,
        this.mostrarPrimeiroErro.submit.pipe(mapTo('submit'))
      );

      this.mostrarPrimeiroErro.registrarInput(this.input, this.ngControl);

      /* monitora mudanças de status do campo, caso exista algum erro,
       o erro é mostrado abaixo do campo */
      this.changes = combineLatest(focus$, status$).subscribe(([focus, status]) => {
        if (this.ngControl.errors && (!focus || status === 'submit')) {
          const erro = this.obterDivErro(this.errosFormulario.formatObjToMsg(this.ngControl.errors));

          if (!this.parent.find('.pleno-erro').length) {
            this.parent.append(erro);
            this.element.nativeElement.classList.add('is-invalid');
            this.parent[0].classList.add('has-danger');
          }
        } else {
          this.parent.find('.pleno-erro').remove();
          this.element.nativeElement.classList.remove('is-invalid');
          this.parent[0].classList.remove('has-danger');
        }
      });
    }
  }

  obterDivErro(msg) {
    return `<span class="d-block pleno-erro invalid-feedback ml-1 ${this.isMatField ? 'mt-1' : ''}">${msg}</span>`;
  }

  ngOnDestroy() {
    if (this.changes instanceof Subscription) {
      this.changes.unsubscribe();
    }

    if (this.proximoCampo instanceof Subscription) {
      this.proximoCampo.unsubscribe();
    }
  }
}
