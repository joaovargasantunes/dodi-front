import { Directive, OnDestroy, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {MascaraService} from '../services/mascara.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[plenoMask]'
})
export class MascaraDirective implements AfterViewInit, OnDestroy {
  @Input('plenoMask')
  formato: keyof MascaraService;

  private atualizacoes: Subscription;

  constructor(
    private ngControl: FormControlName,
    private mascara: MascaraService
  ) {}

  ngAfterViewInit() {
    this.atualizacoes = this.ngControl.valueChanges.pipe(debounceTime(1)).subscribe(() => {
      const formatarFn = this.mascara[this.formato] || this.mascara.padrao(this.formato);
      const valorFormatado = formatarFn(this.ngControl.value) + '';

      if (this.ngControl.value !== valorFormatado) {
        this.ngControl.control.setValue(valorFormatado);
      }
    });
  }

  ngOnDestroy() {
    if (this.atualizacoes instanceof Subscription) {
      this.atualizacoes.unsubscribe();
    }
  }
}
