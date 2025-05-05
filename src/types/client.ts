export interface Client {
  id_cliente?: string | number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  carro: string;
  placa_carro: string;
  carro_alugado: boolean;
  contrato_aluguel: string;
  localizacao_residencial: string;
  comprovante_residencial: string;
  chave_pix: string;
  contato_familiar: string;
  foto_documento_selfie: string;
  status_cliente: string;
  inadimplente?: boolean;
  red_cliente?: boolean;
  asaas_id?: string;
}
