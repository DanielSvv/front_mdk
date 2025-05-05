import React from 'react';
import { LineChart } from '../components/charts/LineChart';
import { StatCard } from '../components/dashboard/StatCard';
import { DollarSign, TrendingUp, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

const revenueData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Receita',
      data: [45000, 52000, 49000, 60000, 55000, 65000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
  ],
};

const expensesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Despesas',
      data: [32000, 35000, 33000, 38000, 36000, 40000],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
  ],
};

export const FinancialPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Financeiro</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <ArrowDownToLine className="w-5 h-5" />
            Exportar Relatório
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpToLine className="w-5 h-5" />
            Importar Dados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Total"
          value="R$ 65.000,00"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: '+12% este mês', positive: true }}
        />
        <StatCard 
          title="Despesas"
          value="R$ 40.000,00"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: '+8% este mês', positive: false }}
        />
        <StatCard 
          title="Lucro Líquido"
          value="R$ 25.000,00"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: '+15% este mês', positive: true }}
        />
        <StatCard 
          title="Margem de Lucro"
          value="38.5%"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: '+3% este mês', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <LineChart title="Receita Mensal" data={revenueData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <LineChart title="Despesas Mensais" data={expensesData} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Últimas Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: '2024-03-15', description: 'Pagamento Cliente ABC', category: 'Receita', amount: 5000, type: 'income' },
                { date: '2024-03-14', description: 'Despesas Operacionais', category: 'Despesa', amount: 2500, type: 'expense' },
                { date: '2024-03-13', description: 'Pagamento Cliente XYZ', category: 'Receita', amount: 3500, type: 'income' },
                { date: '2024-03-12', description: 'Manutenção Sistema', category: 'Despesa', amount: 1500, type: 'expense' },
                { date: '2024-03-11', description: 'Consultoria Tech', category: 'Despesa', amount: 2000, type: 'expense' },
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transaction.type === 'income' ? 'bg-success-100 text-success-800' : 
                      'bg-danger-100 text-danger-800'}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} 
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};