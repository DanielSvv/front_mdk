import React, { useState, useEffect } from "react";
import { Search, Plus, Phone, Mail, AlertTriangle, Trash2 } from "lucide-react";
import { clientsApi } from "../services/api";
import { CreateClientModal } from "../components/clients/CreateClientModal";
import { ClientForm } from "../components/clients/ClientForm";
import type { Client } from "../types/client";

const STORAGE_KEY = "@EvolutionCRM:clients";

// Função utilitária para remover acentos
function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "ativo" | "inativo" | "inadimplente"
  >("all");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);

      // Tenta recuperar dados do localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      const storedLastUpdate = localStorage.getItem(
        `${STORAGE_KEY}:lastUpdate`
      );

      // Verifica se os dados em cache são recentes (menos de 5 minutos)
      const now = new Date().toISOString();
      const cacheIsValid =
        storedLastUpdate &&
        new Date(now).getTime() - new Date(storedLastUpdate).getTime() <
          5 * 60 * 1000;

      if (storedData && cacheIsValid) {
        setClients(JSON.parse(storedData));
        setLastUpdate(storedLastUpdate);
        setLoading(false);
        return;
      }

      // Se não houver cache ou estiver expirado, busca da API
      const data = await clientsApi.getAll();

      // Salva no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(`${STORAGE_KEY}:lastUpdate`, now);

      setClients(data);
      setLastUpdate(now);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id_cliente?: string) => {
    if (!id_cliente) return;
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) {
      return;
    }
    try {
      setDeletingId(id_cliente);
      await clientsApi.delete(id_cliente);
      // Atualiza tanto o estado quanto o localStorage
      const updatedClients = clients.filter(
        (client) => client.id_cliente !== id_cliente
      );
      setClients(updatedClients);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
      setError(null);
    } catch {
      setError("Erro ao excluir cliente");
    } finally {
      setDeletingId(null);
    }
  };

  // Função para forçar atualização dos dados
  const handleRefresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}:lastUpdate`);
    loadClients();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleUpdateClient = async (data: Client) => {
    if (!data.id_cliente) {
      setError("ID do cliente não encontrado!");
      return;
    }
    try {
      // Buscar o cliente original para manter o asaas_id
      const original = clients.find((c) => c.id_cliente === data.id_cliente);
      const payload = {
        id_cliente: String(data.id_cliente),
        nome: data.nome ?? "",
        email: data.email ?? "",
        cpf: data.cpf ?? "",
        endereco: data.endereco ?? "",
        carro: data.carro ?? "",
        placa_carro: data.placa_carro ?? "",
        carro_alugado: Boolean(data.carro_alugado),
        contrato_aluguel: data.contrato_aluguel ?? "",
        localizacao_residencial: data.localizacao_residencial ?? "",
        comprovante_residencial: data.comprovante_residencial ?? "",
        chave_pix: data.chave_pix ?? "",
        contato_familiar: data.contato_familiar ?? "",
        foto_documento_selfie: data.foto_documento_selfie ?? "",
        status_cliente: data.status_cliente ?? "",
        asaas_id: original?.asaas_id ?? "",
        telefone: data.telefone ?? "",
        red_cliente: Boolean(data.red_cliente),
      };
      const updated = await clientsApi.update(
        String(payload.id_cliente),
        payload
      );
      setIsEditModalOpen(false);
      setEditingClient(null);
      setClients((prev) => {
        const newClients = prev.map((c) =>
          c.id_cliente === updated.id_cliente ? updated : c
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
        return newClients;
      });
      setError(null);
    } catch {
      setError("Erro ao atualizar cliente");
    }
  };

  const filteredClients = clients.filter((client) => {
    const search = normalize(searchTerm);
    const matchesSearch =
      normalize(client.nome).includes(search) ||
      normalize(client.email).includes(search) ||
      normalize(client.cpf).includes(search) ||
      normalize(client.telefone).includes(search);
    let matchesStatus = true;
    if (filterStatus === "ativo")
      matchesStatus = client.status_cliente === "ativo";
    if (filterStatus === "inativo")
      matchesStatus = client.status_cliente !== "ativo";
    if (filterStatus === "inadimplente") matchesStatus = !!client.red_cliente;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Última atualização: {new Date(lastUpdate).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 mr-4">
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterStatus === "ativo"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setFilterStatus("ativo")}
            >
              Ativos
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterStatus === "inativo"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setFilterStatus("inativo")}
            >
              Inativos
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterStatus === "inadimplente"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-red-50"
              }`}
              onClick={() => setFilterStatus("inadimplente")}
            >
              Inadimplentes
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Atualizar Lista
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
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
              {filteredClients.map((client) => (
                <tr
                  key={client.id_cliente}
                  className={
                    `hover:bg-gray-50 ` +
                    (client.status_cliente === "pendente"
                      ? "bg-yellow-100"
                      : "")
                  }
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      client.red_cliente ? "bg-red-50 text-red-700" : ""
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        client.red_cliente ? "text-red-700" : "text-gray-900"
                      }`}
                    >
                      {client.nome}
                    </div>
                    <div
                      className={`text-sm ${
                        client.red_cliente ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {client.cpf}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      client.red_cliente ? "text-red-600" : ""
                    }`}
                  >
                    <div className="flex flex-col space-y-1">
                      <div
                        className={`flex items-center text-sm ${
                          client.red_cliente ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {client.telefone}
                      </div>
                      <div
                        className={`flex items-center text-sm ${
                          client.red_cliente ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        client.status_cliente === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status_cliente}
                    </span>
                    {client.red_cliente && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inadimplente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteClient(String(client.id_cliente))
                      }
                      disabled={deletingId === client.id_cliente}
                      className={`text-red-600 hover:text-red-900 inline-flex items-center ${
                        deletingId === client.id_cliente
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === client.id_cliente ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          handleRefresh();
          setIsCreateModalOpen(false);
        }}
      />

      {isEditModalOpen && editingClient && (
        <ClientForm
          initialData={editingClient}
          onSubmit={handleUpdateClient}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingClient(null);
          }}
          isLoading={false}
        />
      )}
    </div>
  );
};
