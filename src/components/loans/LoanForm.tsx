import React, { useState, useEffect } from "react";
import type { Loan } from "../../types/loan";
import type { Client } from "../../types/client";
import { clientsApi } from "../../services/api";

interface LoanFormProps {
  onSubmit: (data: Omit<Loan, "id_emprestimo">) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Omit<Loan, "id_emprestimo">>({
    id_cliente: "",
    valor_emprestimo: 0,
    quantidade_parcelas: 1,
    taxa_juros: 30,
    status_emprestimo: "ativo",
    notification_fds: false,
    valor_total_com_juros: 0,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const data = await clientsApi.getAll();
        setClients(data);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const valor = Number(formData.valor_emprestimo) || 0;
    const taxa = Number(formData.taxa_juros) || 0;
    const total = valor + (valor * taxa) / 100;
    setFormData((prev) => ({ ...prev, valor_total_com_juros: total }));
  }, [formData.valor_emprestimo, formData.taxa_juros]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      id_cliente: Number(formData.id_cliente),
      quantidade_parcelas: Number(formData.quantidade_parcelas),
      valor_emprestimo: formData.valor_total_com_juros || 0,
      taxa_juros: 30,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Novo Empréstimo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              {loadingClients ? (
                <div className="text-gray-500 text-sm">
                  Carregando clientes...
                </div>
              ) : (
                <select
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id_cliente} value={client.id_cliente}>
                      {client.nome} ({client.cpf})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor do Empréstimo
              </label>
              <input
                type="number"
                name="valor_emprestimo"
                value={formData.valor_emprestimo}
                onChange={handleChange}
                required
                min={1}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taxa de Juros (%)
              </label>
              <input
                type="number"
                name="taxa_juros"
                value={formData.taxa_juros}
                onChange={handleChange}
                min={0}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor Total com Juros
              </label>
              <input
                type="number"
                name="valor_total_com_juros"
                value={formData.valor_total_com_juros}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade de Parcelas
              </label>
              <input
                type="number"
                name="quantidade_parcelas"
                value={formData.quantidade_parcelas}
                onChange={handleChange}
                required
                min={1}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notification_fds"
                checked={formData.notification_fds}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Notificar FDS
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
