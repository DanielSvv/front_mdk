import React from "react";
import { User, Phone, Car, MapPin, CreditCard } from "lucide-react";
import type { Client } from "../../types/client";

interface ClientDetailsProps {
  client: Client;
  // onClose: () => void;
  // onEdit: () => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  // onClose,
  // onEdit,
}) => {
  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="text-sm font-medium">{client.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p className="text-sm font-medium">{client.cpf}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
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
          </div>
          <div>
            <p className="text-sm text-gray-500">Cliente Red</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                client.red_cliente
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {client.red_cliente ? "Sim" : "Não"}
            </span>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Contato
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="text-sm font-medium">{client.telefone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm font-medium">{client.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contato Familiar</p>
            <p className="text-sm font-medium">{client.contato_familiar}</p>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Endereço
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Endereço</p>
            <p className="text-sm font-medium">{client.endereco}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Localização Residencial</p>
            <p className="text-sm font-medium">
              {client.localizacao_residencial}
            </p>
          </div>
        </div>
      </div>

      {/* Veículo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Informações do Veículo
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Carro</p>
            <p className="text-sm font-medium">{client.carro}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Placa</p>
            <p className="text-sm font-medium">{client.placa_carro}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status do Aluguel</p>
            <p className="text-sm font-medium">
              {client.carro_alugado ? "Alugado" : "Não Alugado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contrato</p>
            {client.contrato_aluguel ? (
              <a
                href={client.contrato_aluguel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Abrir Arquivo
              </a>
            ) : (
              <span className="text-xs text-gray-400">Não enviado</span>
            )}
          </div>
        </div>
      </div>

      {/* Pagamento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Informações de Pagamento
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Chave PIX</p>
            <p className="text-sm font-medium">{client.chave_pix}</p>
          </div>
        </div>
      </div>

      {/* Outros Dados */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Outros Dados
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Foto do Documento Selfie</p>
            {client.foto_documento_selfie ? (
              client.foto_documento_selfie.endsWith(".pdf") ? (
                <a
                  href={client.foto_documento_selfie}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Clique para abrir o PDF
                </a>
              ) : (
                <img
                  src={client.foto_documento_selfie}
                  alt="Foto do Documento Selfie"
                  className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                  onClick={() =>
                    window.open(client.foto_documento_selfie, "_blank")
                  }
                />
              )
            ) : (
              <span className="text-xs text-gray-400">Não enviado</span>
            )}
          </div>
        </div>
      </div>

      {/* Comprovante Residencial */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Comprovante Residencial
        </h3>
        <div>
          {client.comprovante_residencial ? (
            client.comprovante_residencial.endsWith(".pdf") ? (
              <a
                href={client.comprovante_residencial}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Clique para abrir o PDF
              </a>
            ) : (
              <img
                src={client.comprovante_residencial}
                alt="Comprovante Residencial"
                className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                onClick={() =>
                  window.open(client.comprovante_residencial, "_blank")
                }
              />
            )
          ) : (
            <span className="text-xs text-gray-400">Não enviado</span>
          )}
        </div>
      </div>

      {/* Contrato de Aluguel */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Contrato de Aluguel
        </h3>
        <div>
          {client.contrato_aluguel ? (
            client.contrato_aluguel.endsWith(".pdf") ? (
              <a
                href={client.contrato_aluguel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Clique para abrir o PDF
              </a>
            ) : (
              <img
                src={client.contrato_aluguel}
                alt="Contrato de Aluguel"
                className="rounded-lg shadow max-h-32 border cursor-pointer object-contain bg-white"
                onClick={() => window.open(client.contrato_aluguel, "_blank")}
              />
            )
          ) : (
            <span className="text-xs text-gray-400">Não enviado</span>
          )}
        </div>
      </div>
    </div>
  );
};
