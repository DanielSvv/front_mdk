import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Parcela {
  id_parcela: number;
  numero_parcela: number;
  valor_parcela: number;
  status_pagamento: string;
  data_vencimento: string;
}

interface Emprestimo {
  id_emprestimo: number;
  id_cliente: number;
  valor_emprestimo: number;
  data_emprestimo: string;
  taxa_juros: number;
  status_emprestimo: string;
  data_criacao: string;
}

interface Cliente {
  id_cliente: number;
  nome: string;
  email: string;
  cpf: string;
  endereco: string;
  carro: string;
  placa_carro: string;
  carro_alugado: boolean;
  contrato_aluguel: string;
  localizacao_residencial: string;
  comprovante_residencial: string;
  chave_pix: string;
  contato_familiar: string;
  foto_documento_selfie: string;
  data_criacao: string;
  status_cliente: string;
  asaas_id: string;
  telefone: string;
  red_cliente: boolean;
  emprestimos: Emprestimo[];
}

export function UserHomePage() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tab, setTab] = useState<"dados" | "emprestimos">("emprestimos");
  const [emprestimoAberto, setEmprestimoAberto] = useState<number | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) {
      navigate("/");
      return;
    }
    const usuario = JSON.parse(usuarioStr);
    const id = usuario.id;
    fetch(`https://api-node-mdk.pqfhfk.easypanel.host/api/clientes/${id}`)
      .then((res) => res.json())
      .then((data) => setCliente(data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleExpandirEmprestimo = async (id_emprestimo: number) => {
    if (emprestimoAberto === id_emprestimo) {
      setEmprestimoAberto(null);
      setParcelas([]);
      return;
    }
    setEmprestimoAberto(id_emprestimo);
    setLoadingParcelas(true);
    try {
      const res = await fetch(
        `https://api-node-mdk.pqfhfk.easypanel.host/api/emprestimos/${id_emprestimo}`
      );
      const data = await res.json();
      setParcelas(data.parcelas || []);
    } catch {
      setParcelas([]);
    } finally {
      setLoadingParcelas(false);
    }
  };

  if (!cliente)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-0">
      {/* Cabeçalho */}
      <div className="w-full max-w-sm flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex-1 text-center font-bold text-blue-700 text-lg">
          MDK SOLUÇÕES
        </div>
        <button
          className="text-xs text-blue-600 underline font-semibold ml-2"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/");
          }}
        >
          Sair
        </button>
      </div>
      {/* Menu Tabs */}
      <div className="w-full max-w-sm flex bg-white rounded-b-3xl shadow-md">
        <button
          className={`flex-1 py-4 font-bold ${
            tab === "emprestimos"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-400"
          }`}
          onClick={() => setTab("emprestimos")}
        >
          Meus Empréstimos
        </button>
        <button
          className={`flex-1 py-4 font-bold ${
            tab === "dados"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-400"
          }`}
          onClick={() => setTab("dados")}
        >
          Meus Dados
        </button>
      </div>

      {/* Conteúdo */}
      <div className="w-full max-w-sm flex-1 p-4">
        {tab === "dados" && (
          <div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg shadow p-0 flex flex-col items-center w-full">
            <div className="w-full bg-blue-700 rounded-t-lg p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-2 shadow">
                {cliente.foto_documento_selfie ? (
                  <img
                    src={cliente.foto_documento_selfie}
                    alt="Selfie/Documento"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <span className="text-3xl text-blue-700 font-bold">
                    {cliente.nome.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {cliente.nome}
              </h2>
              <div className="text-blue-100 text-xs mb-2">
                CPF: {cliente.cpf}
              </div>
            </div>
            <div className="w-full p-4 space-y-4">
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">E-mail</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.email}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Telefone</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.telefone}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Endereço</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.endereco}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Carro</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.carro}{" "}
                    {cliente.placa_carro && `- ${cliente.placa_carro}`}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Chave Pix</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.chave_pix}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Contato Familiar</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.contato_familiar}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">
                    Localização Residencial
                  </div>
                  <div className="font-semibold text-gray-800">
                    {cliente.localizacao_residencial}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">
                    Contrato de Aluguel
                  </div>
                  <div className="font-semibold text-gray-800">
                    {cliente.contrato_aluguel &&
                    cliente.contrato_aluguel.match(
                      /\.(jpe?g|png|gif|bmp|webp)$/i
                    ) ? (
                      <img
                        src={cliente.contrato_aluguel}
                        alt="Contrato de Aluguel"
                        className="max-h-32 rounded shadow border object-contain"
                      />
                    ) : (
                      cliente.contrato_aluguel
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">
                    Comprovante Residencial
                  </div>
                  <div className="font-semibold text-gray-800">
                    {cliente.comprovante_residencial &&
                    cliente.comprovante_residencial.match(
                      /\.(jpe?g|png|gif|bmp|webp)$/i
                    ) ? (
                      <img
                        src={cliente.comprovante_residencial}
                        alt="Comprovante Residencial"
                        className="max-h-32 rounded shadow border object-contain"
                      />
                    ) : (
                      cliente.comprovante_residencial
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div>
                  <div className="text-xs text-gray-500">Carro Alugado</div>
                  <div className="font-semibold text-gray-800">
                    {cliente.carro_alugado ? "Sim" : "Não"}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="text-xs text-blue-600 underline mt-4 mb-4"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                navigate("/");
              }}
            >
              Sair
            </button>
          </div>
        )}

        {tab === "emprestimos" && (
          <div>
            <h2 className="text-lg font-bold mb-4 text-blue-700">
              Meus Empréstimos
            </h2>
            {cliente.emprestimos.length === 0 ? (
              <div className="text-gray-500 text-center">
                Nenhum empréstimo encontrado.
              </div>
            ) : (
              <ul className="space-y-4">
                {cliente.emprestimos.map((emp) => (
                  <li
                    key={emp.id_emprestimo}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-800">
                          Valor:{" "}
                          <span className="text-blue-700">
                            R$ {emp.valor_emprestimo.toFixed(2)}
                          </span>
                        </span>
                        <div className="text-sm text-gray-600">
                          Data: {emp.data_emprestimo}
                        </div>
                        <div
                          className={`text-xs font-bold mt-1 ${
                            emp.status_emprestimo === "ativo"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {emp.status_emprestimo === "ativo"
                            ? "Ativo"
                            : "Finalizado"}
                        </div>
                      </div>
                      <button
                        className="text-blue-600 underline text-xs"
                        onClick={() =>
                          handleExpandirEmprestimo(emp.id_emprestimo)
                        }
                      >
                        {emp.id_emprestimo === emprestimoAberto
                          ? "Fechar"
                          : "Ver detalhes"}
                      </button>
                    </div>
                    {/* Detalhes do Empréstimo */}
                    {emp.id_emprestimo === emprestimoAberto && (
                      <div className="mt-4">
                        <div className="mb-2 text-sm text-gray-700">
                          Taxa de juros: {emp.taxa_juros}%
                        </div>
                        <div className="mb-2 text-sm text-gray-700">
                          Data de criação: {emp.data_criacao}
                        </div>
                        {/* Parcelas */}
                        {loadingParcelas ? (
                          <div className="text-center text-gray-500">
                            Carregando parcelas...
                          </div>
                        ) : parcelas.length === 0 ? (
                          <div className="text-center text-gray-500">
                            Nenhuma parcela encontrada.
                          </div>
                        ) : (
                          <ul className="space-y-2 mb-2">
                            {parcelas
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(a.data_vencimento).getTime() -
                                  new Date(b.data_vencimento).getTime()
                              )
                              .map((parc) => (
                                <li
                                  key={parc.id_parcela}
                                  className="flex justify-between items-center bg-blue-50 rounded px-3 py-2"
                                >
                                  <span>Parcela {parc.numero_parcela}</span>
                                  <span>
                                    R$ {parc.valor_parcela.toFixed(2)}
                                  </span>
                                  <span
                                    className={`text-xs font-bold ${
                                      parc.status_pagamento === "paga"
                                        ? "text-green-600"
                                        : parc.status_pagamento === "pendente"
                                        ? "text-red-500"
                                        : parc.status_pagamento === "agendada"
                                        ? "text-yellow-600"
                                        : parc.status_pagamento === "enviado"
                                        ? "text-blue-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {parc.status_pagamento
                                      .charAt(0)
                                      .toUpperCase() +
                                      parc.status_pagamento.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {parc.data_vencimento}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}
                        {/* Antecipar */}
                        {emp.status_emprestimo !== "pago" && (
                          <button
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
                            onClick={() => {
                              window.open(
                                "https://wa.me/556181569275?text=Ol%C3%A1%2C%20desejo%20antecipar%20meu%20emprestimo",
                                "_blank"
                              );
                            }}
                          >
                            Antecipar parcelas
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
