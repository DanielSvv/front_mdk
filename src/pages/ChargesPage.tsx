import React, { useEffect, useState } from "react";
import { loansApi } from "../services/loansApi";
import { clientsApi } from "../services/api";
import type { Loan } from "../types/loan";
import type { Client } from "../types/client";
import { LoanForm } from "../components/loans/LoanForm";
import { ClientDetails } from "../components/clients/ClientDetails";

export const ChargesPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"detalhes" | "emprestimos">(
    "detalhes"
  );
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loadingLoan, setLoadingLoan] = useState(false);
  const [filterLoanStatus, setFilterLoanStatus] = useState<
    "all" | "paga" | "agendada" | "pendente" | "enviado"
  >("all");

  useEffect(() => {
    loadLoansAndClients();
  }, []);

  const loadLoansAndClients = async () => {
    try {
      setLoading(true);
      const [loansData, clientsData] = await Promise.all([
        loansApi.getAll(),
        clientsApi.getAll(),
      ]);
      setLoans(loansData);
      setClients(clientsData);
      setError(null);
    } catch {
      setError("Erro ao carregar empréstimos ou clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLoan = async (id: string) => {
    if (!window.confirm("Deseja cancelar este empréstimo?")) return;
    try {
      await loansApi.cancel(id);
      loadLoansAndClients();
    } catch {
      setError("Erro ao cancelar empréstimo");
    }
  };

  const handleCreateLoan = async (data: Omit<Loan, "id_emprestimo">) => {
    setCreating(true);
    try {
      await loansApi.create(data);
      setIsCreateModalOpen(false);
      loadLoansAndClients();
    } catch {
      setError("Erro ao criar empréstimo");
    } finally {
      setCreating(false);
    }
  };

  // Função para buscar detalhes do empréstimo ou fechar se já estiver aberto
  const toggleLoanDetails = async (id: string) => {
    if (selectedLoan && selectedLoan.id_emprestimo === id) {
      setSelectedLoan(null);
      return;
    }
    setLoadingLoan(true);
    try {
      const loan = await loansApi.getById(id);
      console.log("Detalhes do empréstimo:", loan);
      setSelectedLoan(loan);
    } catch {
      setSelectedLoan(null);
    } finally {
      setLoadingLoan(false);
    }
  };

  // Filtro de empréstimos por status das parcelas
  const filteredLoans = loans.filter((loan) => {
    if (filterLoanStatus === "all") return true;
    if (!loan.parcelas || loan.parcelas.length === 0) return false;
    return loan.parcelas.some((p) => p.status_pagamento === filterLoanStatus);
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Empréstimos</h1>
      {/* Botões de filtro de status das parcelas */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            filterLoanStatus === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
          }`}
          onClick={() => setFilterLoanStatus("all")}
        >
          Todos
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            filterLoanStatus === "paga"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
          }`}
          onClick={() => setFilterLoanStatus("paga")}
        >
          Pagos
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            filterLoanStatus === "agendada"
              ? "bg-yellow-600 text-white border-yellow-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50"
          }`}
          onClick={() => setFilterLoanStatus("agendada")}
        >
          Agendados
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            filterLoanStatus === "pendente"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-red-50"
          }`}
          onClick={() => setFilterLoanStatus("pendente")}
        >
          Pendentes
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            filterLoanStatus === "enviado"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
          }`}
          onClick={() => setFilterLoanStatus("enviado")}
        >
          Enviados
        </button>
      </div>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Novo Empréstimo
      </button>
      {isCreateModalOpen && (
        <LoanForm
          onSubmit={handleCreateLoan}
          onClose={() => setIsCreateModalOpen(false)}
          isLoading={creating}
        />
      )}
      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor do Empréstimo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => {
                  const cliente = clients.find(
                    (c) => String(c.id_cliente) === String(loan.id_cliente)
                  );
                  return (
                    <tr key={loan.id_emprestimo} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => {
                          if (cliente) {
                            setSelectedClient(cliente);
                            setActiveTab("detalhes");
                          }
                        }}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {cliente ? cliente.nome : loan.id_cliente}
                        </div>
                        {cliente && (
                          <div className="text-sm text-gray-500">
                            {cliente.cpf}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loan.valor_emprestimo.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loan.quantidade_parcelas}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-semibold px-2 py-1 rounded inline-block 
                          ${
                            loan.status_emprestimo === "ativo"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                          ${
                            loan.status_emprestimo === "pago"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            loan.status_emprestimo === "pendente"
                              ? "bg-yellow-100 text-yellow-700"
                              : ""
                          }
                          ${
                            loan.status_emprestimo === "inativo"
                              ? "bg-gray-200 text-gray-600"
                              : ""
                          }
                        `}
                        >
                          {loan.status_emprestimo.charAt(0).toUpperCase() +
                            loan.status_emprestimo.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCancelLoan(loan.id_emprestimo!)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <span className="mr-1">&#128465;</span> Cancelar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Cliente e Empréstimos */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b flex">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === "detalhes"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("detalhes")}
              >
                Cliente
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === "emprestimos"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("emprestimos")}
              >
                Empréstimos
              </button>
              <button
                className="px-4 py-3 text-gray-400 hover:text-gray-600 ml-auto"
                onClick={() => setSelectedClient(null)}
                title="Fechar"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {activeTab === "detalhes" && (
                <ClientDetails client={selectedClient} />
              )}
              {activeTab === "emprestimos" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Empréstimos do Cliente
                  </h3>
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Valor
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Parcelas
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans
                        .filter(
                          (l) =>
                            String(l.id_cliente) ===
                            String(selectedClient.id_cliente)
                        )
                        .map((l) => (
                          <tr
                            key={l.id_emprestimo}
                            className="hover:bg-gray-50"
                          >
                            <td
                              className="px-4 py-2 cursor-pointer"
                              onClick={() =>
                                toggleLoanDetails(l.id_emprestimo!)
                              }
                            >
                              {l.valor_emprestimo.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                            <td className="px-4 py-2">
                              {Array.isArray(l.parcelas)
                                ? l.parcelas.length
                                : l.quantidade_parcelas}
                            </td>
                            <td className="px-4 py-2">{l.status_emprestimo}</td>
                            <td className="px-4 py-2">
                              <button
                                className="text-blue-600 hover:underline"
                                onClick={() =>
                                  toggleLoanDetails(l.id_emprestimo!)
                                }
                              >
                                {selectedLoan &&
                                selectedLoan.id_emprestimo === l.id_emprestimo
                                  ? "Fechar Detalhes"
                                  : "Ver Detalhes"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {/* Detalhes do empréstimo selecionado */}
                  {loadingLoan && (
                    <div>Carregando detalhes do empréstimo...</div>
                  )}
                  {selectedLoan && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-md font-semibold mb-2">
                        Detalhes do Empréstimo
                      </h4>
                      <div className="mb-2 text-sm text-gray-700">
                        Valor:{" "}
                        {selectedLoan.valor_emprestimo.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                      <div className="mb-2 text-sm text-gray-700">
                        Parcelas:{" "}
                        {Array.isArray(selectedLoan.parcelas)
                          ? selectedLoan.parcelas.length
                          : selectedLoan.quantidade_parcelas}
                      </div>
                      <div className="mb-2 text-sm text-gray-700">
                        Status: {selectedLoan.status_emprestimo}
                      </div>
                      <div className="mb-2 text-sm text-gray-700">
                        Taxa de Juros: {selectedLoan.taxa_juros}%
                      </div>
                      <div className="mb-2 text-sm text-gray-700">
                        Notificar FDS:{" "}
                        {selectedLoan.notification_fds ? "Sim" : "Não"}
                      </div>
                      <h5 className="font-semibold mt-4 mb-2">Parcelas</h5>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 py-1 text-xs text-gray-500">
                              Nº
                            </th>
                            <th className="px-2 py-1 text-xs text-gray-500">
                              Valor
                            </th>
                            <th className="px-2 py-1 text-xs text-gray-500">
                              Status
                            </th>
                            <th className="px-2 py-1 text-xs text-gray-500">
                              Data de Vencimento
                            </th>
                            <th className="px-2 py-1 text-xs text-gray-500">
                              Data Pagamento
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedLoan.parcelas &&
                            (() => {
                              // Ordena as parcelas pelo número da parcela
                              const parcelasOrdenadas = [
                                ...selectedLoan.parcelas,
                              ].sort(
                                (a, b) => a.numero_parcela - b.numero_parcela
                              );
                              return (
                                <>
                                  {parcelasOrdenadas.map((p) => (
                                    <tr key={`parcela-${p.id_parcela}`}>
                                      <td className="px-2 py-1 text-center">
                                        {p.numero_parcela}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {p.valor_parcela.toLocaleString(
                                          "pt-BR",
                                          { style: "currency", currency: "BRL" }
                                        )}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {p.status_pagamento}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {p.data_vencimento
                                          ? p.data_vencimento
                                              .split("-")
                                              .reverse()
                                              .join("/")
                                          : "-"}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {p.data_pagamento
                                          ? new Date(
                                              p.data_pagamento
                                            ).toLocaleDateString("pt-BR")
                                          : "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              );
                            })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
