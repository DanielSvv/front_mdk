import React, { useEffect, useState } from "react";
import { StatCard } from "../components/dashboard/StatCard";
import { Users, DollarSign, CreditCard } from "lucide-react";
import { clientsApi } from "../services/api";
import { loansApi } from "../services/loansApi";
import type { Loan } from "../types/loan";
import type { Client } from "../types/client";
import { LineChart } from "../components/charts/LineChart";
import { DoughnutChart } from "../components/charts/DoughnutChart";
import dayjs from "dayjs";
// import { monthlyRevenueData, chargesStatusData, upcomingCharges } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const [parcelas, setParcelas] = useState<
    NonNullable<Loan["parcelas"]>[number][]
  >([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Filtro de mês/ano
  const hoje = new Date();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // yyyy-MM
    return dayjs(hoje).format("YYYY-MM");
  });
  const [anoSelecionado, mesSelecionado] = selectedMonth.split("-").map(Number);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parcelasData, clientesData, loansData] = await Promise.all([
          clientsApi.getAllParcelas(),
          clientsApi.getAll(),
          loansApi.getAll(),
        ]);
        setParcelas(parcelasData || []);
        setClientes(clientesData || []);
        setLoans(loansData || []);
        // setError(null);
      } catch {
        // setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cobranças Hoje (ajustar para considerar o mês selecionado)
  const hojeStr = hoje.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const cobrancasHoje = parcelas.filter(
    (p) => p.data_vencimento === hojeStr
  ).length;

  // Receita Prevista (mês selecionado)
  const receitaPrevista = parcelas
    .filter((p) => {
      const [ano, mes] = p.data_vencimento.split("-");
      return (
        p.status_pagamento === "agendada" &&
        Number(ano) === anoSelecionado &&
        Number(mes) === mesSelecionado
      );
    })
    .reduce((acc, p) => acc + (p.valor_parcela || 0), 0);

  // Inadimplentes (clientes com red_cliente true)
  const inadimplentes = clientes.filter((c) => c.red_cliente === true).length;

  // Parcelas do dia (apenas do dia atual)
  const parcelasDoDia = parcelas.filter((p) => p.data_vencimento === hojeStr);

  // Mapeamento de id_emprestimo para id_cliente
  const emprestimoToCliente: Record<string, string | number> = {};
  loans.forEach((loan) => {
    if (loan.id_emprestimo && loan.id_cliente) {
      emprestimoToCliente[String(loan.id_emprestimo)] = loan.id_cliente;
    }
  });

  // --- GRÁFICOS ---
  // 1. Comparativo Mês a Mês (Linha) - Receita total mês a mês de empréstimos pagos
  const loansPagos = loans.filter((l) => l.status_emprestimo === "pago");
  const receitaPorMes: Record<string, number> = {};
  loansPagos.forEach((l) => {
    const data =
      l.parcelas && l.parcelas.length > 0 ? l.parcelas[0].data_criacao : "";
    const [ano, mes] = data ? data.split("-") : [];
    if (ano && mes) {
      const label = `${mes}/${ano}`;
      receitaPorMes[label] = (receitaPorMes[label] || 0) + l.valor_emprestimo;
    }
  });
  const mesesReceita = Object.keys(receitaPorMes).sort((a, b) => {
    const [ma, aa] = a.split("/");
    const [mb, ab] = b.split("/");
    return aa !== ab ? Number(aa) - Number(ab) : Number(ma) - Number(mb);
  });
  const receitaLineChartData = {
    labels: mesesReceita,
    datasets: [
      {
        label: "Receita",
        data: mesesReceita.map((m) => receitaPorMes[m]),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    ],
  };

  // 2. Ticket Médio dos Empréstimos (Gauge)
  const totalTicket = loansPagos.reduce(
    (acc, l) => acc + l.valor_emprestimo,
    0
  );
  const ticketMedio = loansPagos.length ? totalTicket / loansPagos.length : 0;
  const gaugeData = {
    labels: ["Média", "Restante"],
    datasets: [
      {
        data: [ticketMedio, ticketMedio * 0.5],
        backgroundColor: ["#10b981", "#e5e7eb"],
        borderColor: ["#10b981", "#e5e7eb"],
        borderWidth: 1,
      },
    ],
  };

  // Receita do Mês Selecionado: soma das parcelas pagas no mês selecionado (usando data de vencimento)
  const receitaMesAtual = parcelas
    .filter((p) => {
      const [ano, mes] = p.data_vencimento.split("-");
      return (
        p.status_pagamento === "pago" &&
        Number(ano) === anoSelecionado &&
        Number(mes) === mesSelecionado
      );
    })
    .reduce((acc, p) => acc + (p.valor_parcela || 0), 0);

  return (
    <div className="space-y-6">
      {/* Filtro de mês/ano */}
      <div className="flex items-center gap-4 mb-2">
        <label htmlFor="filtro-mes" className="font-medium text-gray-700">
          Mês:
        </label>
        <input
          id="filtro-mes"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cobranças Hoje"
          value={loading ? "..." : cobrancasHoje}
          icon={<CreditCard className="w-5 h-5" />}
          trend={{ value: "", neutral: true }}
        />
        <StatCard
          title="Receita Prevista"
          value={
            loading
              ? "..."
              : receitaPrevista.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
          }
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: "", neutral: true }}
        />
        <StatCard
          title="Inadimplentes"
          value={loading ? "..." : inadimplentes}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: "", neutral: true }}
        />
        <StatCard
          title="Receita do Mês Atual"
          value={
            loading
              ? "..."
              : receitaMesAtual.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
          }
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: "", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LineChart title="Receita Mensal" data={receitaLineChartData} />
        <DoughnutChart title="Ticket Médio dos Empréstimos" data={gaugeData} />
      </div>

      {/* Lista de parcelas do dia */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-4">Parcelas do Dia</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : parcelasDoDia.length === 0 ? (
          <div className="text-gray-500">Nenhuma parcela para hoje.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Nº Parcela
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {parcelasDoDia.map((parcela) => {
                const id_cliente =
                  emprestimoToCliente[String(parcela.id_emprestimo)];
                const cliente = clientes.find(
                  (c) => String(c.id_cliente) === String(id_cliente)
                );
                return (
                  <tr key={parcela.id_parcela} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                      {cliente ? cliente.nome : id_cliente || "-"}
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-gray-700">
                      {parcela.numero_parcela}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap font-semibold text-gray-900">
                      {parcela.valor_parcela?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Os outros componentes do dashboard permanecem, mas dados mockados estão comentados para evitar erro de referência */}
      {/*
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart title="Receita Mensal" data={monthlyRevenueData} />
        <DoughnutChart title="Status das Cobranças" data={chargesStatusData} />
      </div>
      <Alert 
        title="Atenção"
        variant="warning"
        icon={<AlertTriangle className="w-5 h-5" />}
      >
        Existem {upcomingCharges.length} cobranças que vencem hoje. <a href="#" className="font-medium underline">Clique para ver detalhes.</a>
      </Alert>
      */}
    </div>
  );
};
