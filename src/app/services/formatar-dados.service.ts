import { Injectable } from '@angular/core';
import * as VMasker from 'vanilla-masker';
import { format, distanceInWordsToNow } from 'date-fns';
import * as pt from 'date-fns/locale/pt';

export type TIPO_VALOR = 'inteiro' | 'percentual' | 'valor' | 'peso';

export type TIPO_INFORMACAO =
  | 'inteiro'
  | 'percentual'
  | 'valor'
  | 'dinheiro'
  | 'cpf'
  | 'cnpj'
  | 'cpfCnpj'
  | 'telefone'
  | 'celular'
  | 'celularDDD'
  | 'cep';

export const PRECISAO_VALOR: { [tipo in TIPO_VALOR]: number } = {
  inteiro: 0,
  percentual: 2,
  valor: 2,
  peso: 3
};

@Injectable({
  providedIn: 'root'
})
export class FormatarDadosService {
  constructor() { }

  formatarValor(valor: number | string, tipo: TIPO_VALOR) {
    const precisao = PRECISAO_VALOR[tipo];
    const str = typeof valor === 'number' ? valor.toFixed(precisao) : valor;
    const negativo = str && str[0] === '-' ? '-' : '';
    return str ? negativo + VMasker.toMoney(str, { unit: '', precision: precisao }) : '';
  }

  formatarValorSys(valor: number | string) {
    if (typeof valor === 'number') {
      return valor;
    } else {
      return valor ? parseFloat(valor.replace(/\./gi, '').replace(',', '.')) : null;
    }
  }

  formatarData(data: Date | string, formato: string) {
    return this.capitalizarPalavras((data && format(data, formato, { locale: pt })) || '');
  }

  formatarDistanciaData(data: Date | string) {
    const retorno = (data && distanceInWordsToNow(data, { locale: pt, addSuffix: true })) || '';
    return retorno.replace(/aproximadamente/, 'aprox.');
  }

  capitalizar(str: string) {
    if (typeof str === 'string') {
      return str.replace(/^\s*\w/gi, l => l.toUpperCase());
    } else {
      return str;
    }
  }

  capitalizarPalavras(str: string) {
    const PREPOSICOES = ['a', 'com', 'em', 'por', 'entre', 'sem', 'de', 'para', 'sob', 'desde'];

    if (typeof str === 'string') {
      return str.replace(/\b\w+/gi, w => (PREPOSICOES.indexOf(w) !== -1 ? w : this.capitalizar(w)));
    } else {
      return str;
    }
  }

  formatarInformacao(tipo: TIPO_INFORMACAO, v: string) {
    v = typeof v === 'string' ? v : '';

    switch (tipo) {
      case 'inteiro':
        return VMasker.toMoney(v, { unit: '', precision: 0 });
      case 'percentual':
        return VMasker.toMoney(v, { unit: '', precision: 1 });
      case 'valor':
        return VMasker.toMoney(v, { unit: '', precision: 2 });
      case 'dinheiro':
        return VMasker.toMoney(v, { unit: 'R$', precision: 2 });
      case 'cpf':
        return VMasker.toPattern(v, '999.999.999-99');
      case 'cnpj':
        return VMasker.toPattern(v, '99.999.999/9999-99');
      case 'cpfCnpj':
        return ((v || '').replace(/[^\d]/g, '').length <= 11 ? VMasker.toPattern(v, '999.999.999-99') : VMasker.toPattern(v, '99.999.999/9999-99'));
      case 'celular':
        return VMasker.toPattern(v, '(99) 99999-9999');
      case 'telefone':
        const celular = v.replace(/\D/gi, '').length > 10;
        return VMasker.toPattern(v, celular ? '(99) 99999-9999' : '(99) 9999-9999');
      case 'cep':
        return VMasker.toPattern(v, '99999-999');
      default:
        throw new Error(`Formato inválido! formatarInformacao(${tipo}, ${v}})`);
    }
  }
}
