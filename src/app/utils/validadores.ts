import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as CNPJ from '@fnando/cnpj';
import * as CPF from '@fnando/cpf';
import * as moment from 'moment';
import { of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { formatNum } from './common';

export namespace Validadores {
  export const obrigatorio: ValidatorFn = (control: AbstractControl) => {
    const value = control.value && typeof control.value === 'string' ? control.value.trim() : null;
    return !value ? { obrigatorio: { value } } : null;
  };

  export const cpf: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    return value && !CPF.isValid(value) ? { cpf: { value } } : null;
  };

  export const cnpj: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    return value && !CNPJ.isValid(value) ? { cnpj: { value } } : null;
  };

  export const cpfCnpj: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    return value && (((value || '').replace(/[^\d]/g, '').length <= 11 ? !CPF.isValid(value) : !CNPJ.isValid(value)) ? { cpfCnpj: { value } } : null);
  };

  export const telefone: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value || '').replace(/[\D]*/gi, '');

    if (value.length && [10, 11].indexOf(value.length) === -1) {
      return { telefone: { value } };
    } else {
      return null;
    }
  };

  export const celular: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value || '').replace(/[\D]*/gi, '');

    if (value.length && value.length !== 11) {
      return { telefone: { value } };
    } else {
      return null;
    }
  };

  export const celularSemDDD: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value || '').replace(/[\D]*/gi, '');
    if (value.length && value.length !== 9) {
      return { telefone: { value } };
    } else {
      return null;
    }
  };

  export function telInput(required = false): ValidatorFn {
    return (control: AbstractControl) => {
      let { ddi, numero } = control.value;

      numero = (numero || '').replace(/[\D]*/gi, '');

      if (ddi != 55)
        return null;

      switch (numero?.length) {
        case 11:
        case 10:
          return null;
        case 0:
          return required ? { required: { numero } } : null;
        default:
          return { telefone: { numero } };
      }
    };
  };

  export function valoresIguais(campo: string, label: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.parent && control.parent.get(campo)) {
        const valor1 = control.parent.get(campo).value;
        const valor2 = control.value;
        return valor2 && valor1 !== valor2 ? { valoresIguais: { valor1, valor2, label } } : null;
      }
    };
  }

  export function valoresDiferentes(campo: string, label: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.parent && control.parent.get(campo)) {
        const valor1 = control.parent.get(campo).value;
        const valor2 = control.value;
        return valor2 && valor1 === valor2
          ? { valoresDiferentes: { valor1, valor2, label } }
          : null;
      }
    };
  }

  export const valorDiferenteDeZero: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    return formatNum(value) > 0 ? null : { valorDiferenteDeZero: { value } };
  };

  export const cep: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value || '').replace(/[\D]*/gi, '');
    if (value?.length !== 8 && value?.length) {
      return { cep: { value } };
    } else {
      return null;
    }
  };

  export const cpfDisponivel =
    (fnBackend: Function) => {
      return (control: AbstractControl) => {
        return of(null)
          .pipe(
            switchMap(() => (!control.value ? of(null) : fnBackend(control.value))),
            map((res: any) => {
              return !res || Array.isArray(res) ? null : { cpfDisponivel: control.value };
            })
          );
      };
    };

  export const data: ValidatorFn = (control: AbstractControl) => {

    if (!control?.value?.length)
      return null;

    if (control?.value?.length !== 10 || !moment(control.value, 'DD/MM/YYYY').isValid()) {
      return { data: { value: control.value } };
    } else {
      return null;
    }
  };

  export const numeroInteiro: ValidatorFn = (control: AbstractControl) => {

    if (!control?.value?.length)
      return null;

    if (!Number.isInteger(Number(control.value))) {
      return { numeroInteiro: { value: control.value } };
    } else {
      return null;
    }
  };

  export const registroDisponivel =
    (keyErro: string, fnBackend: Function) => {
      return (control: AbstractControl) => {
        return of(null)
          .pipe(
            //filter((v) => v),
            switchMap(() => (!control.value ? of(null) : fnBackend(control.value))),
            map((res: any) => {
              return !res || (Array.isArray(res) && res.length === 0) ? null : { [keyErro]: control.value };
            })
          );
      };
    };
}
