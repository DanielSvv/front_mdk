import React, { useState } from "react";
import { X } from "lucide-react";
import { clientsApi } from "../../services/api";
import type { Client } from "../../types/client";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Client, "id_cliente">>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    carro: "",
    placa_carro: "",
    carro_alugado: false,
    contrato_aluguel: "",
    localizacao_residencial: "",
    comprovante_residencial: "",
    chave_pix: "",
    contato_familiar: "",
    foto_documento_selfie: "",
    status_cliente: "ativo",
    red_cliente: false,
  });

  const [fileInputs, setFileInputs] = useState({
    contrato_aluguel: null as File | null,
    comprovante_residencial: null as File | null,
    foto_documento_selfie: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFileInputs((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Garantir telefone no formato 55 + DDD + número
      const telefoneNumerico = formData.telefone.replace(/\D/g, "");
      let telefoneFormatado = telefoneNumerico;
      if (!telefoneNumerico.startsWith("55")) {
        telefoneFormatado = "55" + telefoneNumerico.replace(/^55+/, "");
      }
      const formToSend = { ...formData, telefone: telefoneFormatado };
      // Montar FormData
      const formDataToSend = new FormData();
      Object.entries(formToSend).forEach(([key, value]) => {
        if (
          key === "contrato_aluguel" ||
          key === "comprovante_residencial" ||
          key === "foto_documento_selfie"
        ) {
          if (fileInputs[key as keyof typeof fileInputs]) {
            formDataToSend.append(
              key,
              fileInputs[key as keyof typeof fileInputs] as File
            );
          }
        } else {
          formDataToSend.append(key, value as string);
        }
      });
      await clientsApi.create(formDataToSend);
      onSuccess();
      onClose();
    } catch {
      setError("Erro ao criar cliente. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Novo Cliente
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chave PIX
                    </label>
                    <input
                      type="text"
                      value={formData.chave_pix}
                      onChange={(e) =>
                        setFormData({ ...formData, chave_pix: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Endereço
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) =>
                        setFormData({ ...formData, endereco: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Localização Residencial
                    </label>
                    <input
                      type="text"
                      value={formData.localizacao_residencial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          localizacao_residencial: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informações do Veículo */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações do Veículo
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Carro
                    </label>
                    <input
                      type="text"
                      value={formData.carro}
                      onChange={(e) =>
                        setFormData({ ...formData, carro: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Placa do Carro
                    </label>
                    <input
                      type="text"
                      value={formData.placa_carro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placa_carro: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contrato de Aluguel
                    </label>
                    <input
                      type="file"
                      name="contrato_aluguel"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        checked={formData.carro_alugado}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carro_alugado: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Carro Alugado
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Documentos e Contatos */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Documentos e Contatos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Comprovante Residencial
                    </label>
                    <input
                      type="file"
                      name="comprovante_residencial"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Foto Documento com Selfie
                    </label>
                    <input
                      type="file"
                      name="foto_documento_selfie"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contato Familiar
                    </label>
                    <input
                      type="text"
                      value={formData.contato_familiar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contato_familiar: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status do Cliente
                    </label>
                    <select
                      value={formData.status_cliente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status_cliente: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="pendente">Pendente</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        checked={formData.red_cliente}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            red_cliente: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Cliente RED
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
