import type { Client } from "../types/client";
import type { Loan } from "../types/loan";

const API_BASE_URL = "https://api-node-mdk.pqfhfk.easypanel.host/api";

export const clientsApi = {
  // Buscar todos os clientes
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    if (!response.ok) throw new Error("Erro ao buscar clientes");
    return response.json();
  },

  // Buscar cliente por CPF
  getByCpf: async (cpf: string): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clientes/cpf/${cpf}`);
    if (!response.ok) throw new Error("Cliente não encontrado");
    return response.json();
  },

  // Buscar cliente por ID
  getById: async (id: string): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    if (!response.ok) throw new Error("Cliente não encontrado");
    return response.json();
  },

  // Criar novo cliente
  create: async (client: Omit<Client, "id"> | FormData): Promise<Client> => {
    let body: BodyInit;
    const headers: Record<string, string> = {};
    if (client instanceof FormData) {
      body = client;
      // Não definir Content-Type, o navegador faz isso
    } else {
      body = JSON.stringify(client);
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) throw new Error("Erro ao criar cliente");
    return response.json();
  },

  // Atualizar cliente
  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao atualizar cliente: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição de atualização de cliente:", error);
      throw error;
    }
  },

  // Deletar cliente
  delete: async (id_cliente: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id_cliente}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar cliente");
  },

  // Buscar todas as parcelas
  getAllParcelas: async (): Promise<Loan["parcelas"]> => {
    const response = await fetch(`${API_BASE_URL}/parcelas`);
    if (!response.ok) throw new Error("Erro ao buscar parcelas");
    return response.json();
  },
};
