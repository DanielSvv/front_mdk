import type { Loan } from "../types/loan";

const API_BASE_URL = "https://api-node-mdk.pqfhfk.easypanel.host/api";

export const loansApi = {
  getAll: async (): Promise<Loan[]> => {
    const response = await fetch(`${API_BASE_URL}/emprestimos`);
    if (!response.ok) throw new Error("Erro ao buscar empréstimos");
    return response.json();
  },
  getById: async (id: string): Promise<Loan> => {
    const response = await fetch(`${API_BASE_URL}/emprestimos/${id}`);
    if (!response.ok) throw new Error("Empréstimo não encontrado");
    return response.json();
  },
  create: async (loan: Omit<Loan, "id_emprestimo">): Promise<Loan> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { valor_total_com_juros, status_emprestimo, ...loanData } = loan;
    const body = JSON.stringify({ ...loanData, taxa_juros: 30 });
    console.log("Enviando empréstimo:", body);
    const response = await fetch(`${API_BASE_URL}/emprestimos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (!response.ok) throw new Error("Erro ao criar empréstimo");
    return response.json();
  },
  cancel: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/emprestimos/${id}/cancelar`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Erro ao cancelar empréstimo");
  },
};
