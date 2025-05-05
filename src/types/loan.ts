export interface Loan {
  id_emprestimo?: string;
  id_cliente: string | number;
  valor_emprestimo: number;
  quantidade_parcelas: number;
  taxa_juros: number;
  status_emprestimo: string;
  notification_fds: boolean;
  valor_total_com_juros?: number;
  parcelas?: Array<{
    id_parcela: number;
    id_emprestimo: number;
    numero_parcela: number;
    valor_parcela: number;
    data_vencimento: string;
    status_pagamento: string;
    data_pagamento: string | null;
    data_criacao: string;
    asaas_payment_id: string | null;
    pix_payload: string | null;
    notification_fds: boolean;
  }>;
}
