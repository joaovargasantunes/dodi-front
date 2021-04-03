export interface Pessoa {
  pes_telefone_ddi: string;
  responsaveis: Pessoa[];
  uf: Uf;
  cidade: Cidade;
  bairro: Bairro;
  pes_codigo: number;
  pro_codigo: number;
  pes_nome: string;
  pes_tipo: string;
  pes_cpf: string;
  pes_cnpj: string
  pes_rg: string;
  pes_nome_fantasia: string;
  pes_razao_social: string;
  pes_contato_responsavel: string;
  pes_data_nascimento: string;
  pes_data_cadastro: string;
  pes_estado_civil: string;
  pes_naturalidade: string;
  pes_cep: string;
  pes_endereco: string;
  pes_numero: string;
  pes_cep_cor: string;
  pes_endereco_cor: string;
  pes_numero_cor: string;
  bai_codigo: number;
  bai_codigo_cor: number;
  uf_codigo: number;
  uf_codigo_cor: number;
  cid_codigo: number;
  cid_codigo_cor: number;
  pes_ativa: string;
  pes_usar_endereco_cor: boolean;
  nac_codigo: string;
  pes_passaporte: string;
  pes_codigo_conjuge: string;
  pes_email: string;
  pes_telefone: string;
  pes_complemento: string;
  pes_complemento_cor: string;
  pes_senha: string;
  pes_senha_provisoria: string;
  pes_codigo_importacao: string;
  usu_codigo: string;
  pes_codigo_aux: string;
  pes_codigo_responsavel: string;
  session_id: string;
  pes_sexo: string;
  pes_codigo_externo: string;
  pes_conjuge: string;
  int_codigo: string;
  pes_cnh: string;
  pes_orgao_expedidor: string;
  pes_area_cliente: string;
  pes_area_cliente_locatario: string;
  pes_area_cliente_locador: string;
  pes_area_cliente_dimob: string;
  pes_data_desativacao: string;
  pes_nome_pai: string;
  pes_nome_mae: string;
  forma_pagamento: string;
  pes_con_codigo: string;
  pes_ie: string;
  pes_orgao_expedidor_expedicao: string;
  timestamp: string;
  pes_primeiro_acesso?: number;
  contatos: PessoaContato[];
  pes_responsaveis: number[];
  pes_codigo_mae: number;
  pes_codigo_pai: number;
  auth_token?: string;
  pes_logo: string;
  is_locatario: boolean;
  is_locador: boolean;
}

export interface PessoaContato {
  pes_con_codigo: string;
  pes_codigo: number;
  tip_con_codigo: number;
  pes_con_contato: string;
  pes_con_descricao: string;
}

export interface TipoContato {
  tip_con_codigo: number;
  tip_con_descricao: string;
}

export interface ErrorBackend {
  code?: number;
  message?: string;
  validation?: any;
}

export interface ApiData<T> {
  code?: number,
  error: ErrorBackend,
  validation?: any[],
  success?: boolean,
  data: T
}

export interface Usuario {
  auth_token: string;
  timestamp: string;
  usu_codigo: number;
  usu_nome: string;
  usu_email: string;
  usu_telefone: string;
  usu_usuario: string;
  usu_senha: string;
  gru_codigo: number;
  usu_token: string;
}

export interface Endereco {
  bai_codigo: number;
  bai_nome: string;
  cid_codigo: number;
  cid_nome: string;
  complemento: string;
  logradouro: string;
  uf_codigo: number;
  uf_uf: string;
}

export interface Uf {
  uf_codigo: number;
  uf_nome: string;
  uf_uf: string;
  uf_codigo_ibge: string;
}

export interface Cidade {
  cid_codigo: number;
  cid_nome: string;
  cid_cep: string;
  cid_ddd: string;
  uf_codigo: number;
}

export interface Bairro {
  bai_codigo: number;
  bai_nome: string;
  bai_apelido: string;
  cid_codigo: number;
  bai_uf: number;
  bai_status: string;
}
