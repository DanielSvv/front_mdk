import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Client } from "../types/client";
import { ClientDetails } from "../components/clients/ClientDetails";
import { loansApi } from "../services/loansApi";
import type { Loan } from "../types/loan";

interface ClientModalContextType {
  openClientModal: (
    client: Client,
    initialTab?: "detalhes" | "emprestimos"
  ) => void;
  closeClientModal: () => void;
}

const ClientModalContext = createContext<ClientModalContextType | undefined>(
  undefined
);

export const ClientModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"detalhes" | "emprestimos">(
    "detalhes"
  );
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loadingLoan, setLoadingLoan] = useState(false);

  const openClientModal = (
    client: Client,
    initialTab: "detalhes" | "emprestimos" = "detalhes"
  ) => {
    setSelectedClient(client);
    setActiveTab(initialTab);
    setSelectedLoan(null);
    loansApi.getAll().then(setLoans);
  };

  const closeClientModal = () => {
    setSelectedClient(null);
    setSelectedLoan(null);
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
      setSelectedLoan(loan);
    } catch {
      setSelectedLoan(null);
    } finally {
      setLoadingLoan(false);
    }
  };

  return (
    <ClientModalContext.Provider value={{ openClientModal, closeClientModal }}>
      {children}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
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
                onClick={closeClientModal}
                title="Fechar"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {activeTab === "detalhes" && (
                <>
                  {/* Documentos do Cliente */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Foto do Documento Selfie */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Documento Selfie
                      </label>
                      {selectedClient.foto_documento_selfie ? (
                        <a
                          href={selectedClient.foto_documento_selfie}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                    {/* Comprovante Residencial */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Comprovante Residencial
                      </label>
                      {selectedClient.comprovante_residencial ? (
                        <a
                          href={selectedClient.comprovante_residencial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                    {/* Contrato de Aluguel */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Contrato de Aluguel
                      </label>
                      {selectedClient.contrato_aluguel ? (
                        <a
                          href={selectedClient.contrato_aluguel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                  </div>
                  <ClientDetails client={selectedClient} />
                </>
              )}
              {activeTab === "emprestimos" && (
                <div>
                  {/* Documentos do Cliente */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Foto do Documento Selfie */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Documento Selfie
                      </label>
                      {selectedClient.foto_documento_selfie ? (
                        <a
                          href={selectedClient.foto_documento_selfie}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                    {/* Comprovante Residencial */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Comprovante Residencial
                      </label>
                      {selectedClient.comprovante_residencial ? (
                        <a
                          href={selectedClient.comprovante_residencial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                    {/* Contrato de Aluguel */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Contrato de Aluguel
                      </label>
                      {selectedClient.contrato_aluguel ? (
                        <a
                          href={selectedClient.contrato_aluguel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Abrir Imagem
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Não enviado
                        </span>
                      )}
                    </div>
                  </div>
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
    </ClientModalContext.Provider>
  );
};

export const useClientModal = () => {
  const context = useContext(ClientModalContext);
  if (context === undefined) {
    throw new Error("useClientModal must be used within a ClientModalProvider");
  }
  return context;
};
