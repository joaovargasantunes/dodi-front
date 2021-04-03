import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class ErrosFormularioService {
  constructor(private toaster: ToastrService) {
  }

  formatObjToMsg(obj: Object, onlyFirst = false): string {
    const erros = Object.keys(obj)
      .map(key => this.formatMsg(key, obj[key]));

    return onlyFirst ? erros.pop() : erros.join('<br>');
  }

  public formatMsg(key, value) {
    switch (key) {
      case 'required':
        return 'Campo Obrigatório!';
      case 'obrigatorio':
        return 'Campo Obrigatório, espaços em branco não são considerados!';
      case 'minlength':
        return `Informe no mínimo ${value.requiredLength} caractéres!`;
      case 'maxlength':
        return `Informe no máximo ${value.requiredLength} caractéres!`;
      case 'min':
        return `Informe um número maior ou igual a ${value.min}!`;
      case 'max':
        return `Informe um número menor ou igual a ${value.max}!`;
      case 'pattern':
        return `Informe um valor válido para a seguinte expressão regular ${
          value.requiredPattern
        }!`;
      case 'email':
        return 'E-mail inválido!';
      case 'cpf':
        return 'CPF inválido!';
      case 'cnpj':
        return 'CNPJ inválido!';
      case 'cpfCnpj':
        return 'CPF ou CNPJ inválido!';
      case 'telefone':
        return 'Telefone incompleto!';
      case 'valoresIguais':
        return `Valor deve ser igual ${value.label}!`;
      case 'valoresDiferentes':
        return `Valor deve ser diferente ${value.label}!`;
      case 'disponibilidade':
        return `${value.label} já utilizado!`;
      case 'valorDiferenteDeZero':
        return `Valor deve ser maior que R$ 0,00!!`;
      case 'cpfDisponivel':
        return `CPF já cadastrado!`;
      case 'pessoaIndisponivelCliente':
        return `Pessoa já vinculada a outro cliente!`;
      case 'cep':
        return `CEP inválido!`;
      case 'data':
        return `Data inválida!`;
      default:
        return 'Valor inválido!';
    }
  }

  validForm(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();
    });
    this.toaster.error('Erro nas validação das informações. Verifique os dados informados.', 'Oppps!');
  }
}
