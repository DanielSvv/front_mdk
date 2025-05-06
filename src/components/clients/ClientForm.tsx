import React, { useState } from "react";
import { X } from "lucide-react";
import type { Client } from "../../types/client";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Client) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

// Função para aplicar máscara e garantir que começa com 55
function maskPhone(value: string) {
  // Remove tudo que não for número
  let onlyNums = value.replace(/\D/g, "");
  // Garante que começa com 55
  if (!onlyNums.startsWith("55")) {
    onlyNums = "55" + onlyNums.replace(/^55+/, "");
  }
  // Aplica máscara visual: +55 (XX) XXXXX-XXXX
  let masked = onlyNums;
  if (masked.length > 2) masked = "+" + masked;
  if (masked.length > 4) masked = masked.slice(0, 3) + " (" + masked.slice(3);
  if (masked.length > 7) masked = masked.slice(0, 7) + ") " + masked.slice(7);
  if (masked.length > 13) masked = masked.slice(0, 13) + "-" + masked.slice(13);
  if (masked.length > 18) masked = masked.slice(0, 18);
  return masked;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Client>({
    id_cliente: initialData?.id_cliente ?? "",
    nome: initialData?.nome || "",
    email: initialData?.email || "",
    telefone: initialData?.telefone || "",
    cpf: initialData?.cpf || "",
    endereco: initialData?.endereco || "",
    carro: initialData?.carro || "",
    placa_carro: initialData?.placa_carro || "",
    carro_alugado: initialData?.carro_alugado || false,
    contrato_aluguel: initialData?.contrato_aluguel || "",
    localizacao_residencial: initialData?.localizacao_residencial || "",
    comprovante_residencial: initialData?.comprovante_residencial || "",
    chave_pix: initialData?.chave_pix || "",
    contato_familiar: initialData?.contato_familiar || "",
    foto_documento_selfie: initialData?.foto_documento_selfie || "",
    status_cliente: initialData?.status_cliente || "ativo",
    red_cliente: initialData?.red_cliente || false,
  });

  // Estado para modal de imagem
  const [modalImg, setModalImg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "telefone") {
      setFormData((prev) => ({
        ...prev,
        telefone: maskPhone(value),
      }));
    } else if (name === "inadimplente" || name === "red_cliente") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        red_cliente: checked,
        status_cliente: checked
          ? "inadimplente"
          : prev.status_cliente === "inadimplente"
          ? "ativo"
          : prev.status_cliente,
      }));
    } else if (name === "status_cliente") {
      setFormData((prev) => ({
        ...prev,
        status_cliente: value,
        red_cliente: value === "inadimplente" ? true : prev.red_cliente,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ao salvar, envia apenas números, começando com 55
    const telefoneNumerico = formData.telefone.replace(/\D/g, "");
    const isNovo = !initialData;
    await onSubmit({
      ...formData,
      telefone: telefoneNumerico,
      status_cliente: isNovo ? "pendente" : formData.status_cliente,
      red_cliente: isNovo ? false : formData.red_cliente,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
          aria-label="Fechar modal"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-center w-full text-blue-700 tracking-tight">
              {initialData ? "Editar Cliente" : "Novo Cliente"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dados Pessoais */}
              <div className="bg-gray-50 rounded-xl p-6 shadow space-y-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Dados Pessoais
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                    placeholder="+55 (XX) XXXXX-XXXX"
                  />
                </div>
              </div>

              {/* Veículo */}
              <div className="bg-gray-50 rounded-xl p-6 shadow space-y-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Veículo
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Carro
                  </label>
                  <input
                    type="text"
                    name="carro"
                    value={formData.carro}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Placa do Carro
                  </label>
                  <input
                    type="text"
                    name="placa_carro"
                    value={formData.placa_carro}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Contrato de Aluguel
                    </label>
                    <input
                      type="text"
                      name="contrato_aluguel"
                      value={formData.contrato_aluguel}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                    />
                    {formData.contrato_aluguel &&
                      (formData.contrato_aluguel.endsWith(".pdf") ? (
                        <div className="flex flex-col items-center mt-2">
                          <a
                            href={formData.contrato_aluguel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            Clique para abrir o PDF
                          </a>
                        </div>
                      ) : (
                        /\.(jpe?g|png|gif|bmp|webp)$/i.test(
                          formData.contrato_aluguel
                        ) && (
                          <div className="flex flex-col items-center mt-2">
                            <img
                              src={formData.contrato_aluguel}
                              alt="Contrato de Aluguel"
                              className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                              onClick={() =>
                                setModalImg(formData.contrato_aluguel)
                              }
                            />
                            <span className="text-xs text-gray-400 mt-1">
                              Clique para ampliar
                            </span>
                          </div>
                        )
                      ))}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="carro_alugado"
                    checked={formData.carro_alugado}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-700">
                    Carro Alugado
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Endereço */}
              <div className="bg-gray-50 rounded-xl p-6 shadow space-y-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Endereço
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Localização Residencial
                  </label>
                  <input
                    type="text"
                    name="localizacao_residencial"
                    value={formData.localizacao_residencial}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Comprovante Residencial
                  </label>
                  <input
                    type="text"
                    name="comprovante_residencial"
                    value={formData.comprovante_residencial}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                  {formData.comprovante_residencial &&
                    (formData.comprovante_residencial.endsWith(".pdf") ? (
                      <div className="flex flex-col items-center mt-2">
                        <a
                          href={formData.comprovante_residencial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Clique para abrir o PDF
                        </a>
                      </div>
                    ) : (
                      /\.(jpe?g|png|gif|bmp|webp)$/i.test(
                        formData.comprovante_residencial
                      ) && (
                        <div className="flex flex-col items-center mt-2">
                          <img
                            src={formData.comprovante_residencial}
                            alt="Comprovante Residencial"
                            className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                            onClick={() =>
                              setModalImg(formData.comprovante_residencial)
                            }
                          />
                          <span className="text-xs text-gray-400 mt-1">
                            Clique para ampliar
                          </span>
                        </div>
                      )
                    ))}
                </div>
              </div>

              {/* Outros Dados */}
              <div className="bg-gray-50 rounded-xl p-6 shadow space-y-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Outros Dados
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    name="chave_pix"
                    value={formData.chave_pix}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Contato Familiar
                  </label>
                  <input
                    type="text"
                    name="contato_familiar"
                    value={formData.contato_familiar}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Foto do Documento Selfie
                  </label>
                  {formData.foto_documento_selfie &&
                    /\.(jpe?g|png|gif|bmp|webp)$/i.test(
                      formData.foto_documento_selfie
                    ) && (
                      <div className="flex flex-col items-center mt-2">
                        <img
                          src={formData.foto_documento_selfie}
                          alt="Foto do Documento Selfie"
                          className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                          onClick={() =>
                            setModalImg(formData.foto_documento_selfie)
                          }
                        />
                        <span className="text-xs text-gray-400 mt-1">
                          Clique para ampliar
                        </span>
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Status do Cliente
                  </label>
                  <select
                    name="status_cliente"
                    value={formData.status_cliente}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-2"
                  >
                    <option value="ativo">ativo</option>
                    <option value="pendente">pendente</option>
                    <option value="inadimplente">inadimplente</option>
                  </select>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="red_cliente"
                    checked={formData.red_cliente}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-xs text-gray-700">
                    Inadimplente
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal de imagem expandida */}
      {modalImg && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold z-50 hover:text-blue-300"
            onClick={() => setModalImg(null)}
            aria-label="Fechar imagem"
          >
            ×
          </button>
          <img
            src={modalImg}
            alt="Visualização"
            className="max-h-[80vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};
