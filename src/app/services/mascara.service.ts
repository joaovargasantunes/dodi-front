import { Injectable } from '@angular/core';
import * as VMasker from 'vanilla-masker';

@Injectable({ providedIn: 'root' })
export class MascaraService {
  inteiro = (v: string) => VMasker.toMoney(v || '', { unit: '', precision: 0 });
  percentual = (v: string) => VMasker.toMoney(v || '', { unit: '', precision: 1 });
  valor = (v: string) => VMasker.toMoney(v || '', { unit: '', precision: 2 });
  dinheiro = (v: string) => VMasker.toMoney(v || '', { unit: 'R$', precision: 2 });
  cpf = (v: string) => VMasker.toPattern(v || '', '999.999.999-99');
  cnpj = (v: string) => VMasker.toPattern(v || '', '99.999.999/9999-99');
  cpfCnpj = (v: string) => ((v || '').replace(/[^\d]/g, '').length <= 11 ? this.cpf(v) : this.cnpj(v));
  celularDDD = (v: string) => VMasker.toPattern(v || '', '(99) 99999-9999');
  telefoneDDD = (v: string) => {
    v = (v || '').replace(/[^\d]/g, '');
    return VMasker.toPattern(v || '', v.length === 11 ? '(99) 99999-9999' : '(99) 9999-9999');
  }
  usuario = (v: string) => (typeof v === 'string' && v.replace(/[^\d\.\w]/, '').toLocaleLowerCase()) || '';
  DDD = (v: string) => VMasker.toPattern(v || '', '99');
  celular = (v: string) => VMasker.toPattern(v || '', '99999-9999');
  cep = (v: string) => VMasker.toPattern(v || '', '99999-999');
  data = (v: string) => VMasker.toPattern(v || '', '99/99/9999');
  padrao = (padrao: string) => (v: string) => VMasker.toPattern(v, padrao);
}
