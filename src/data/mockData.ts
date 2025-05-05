// Mock data for the CRM dashboard

// Monthly revenue data
export const monthlyRevenueData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Receita',
      data: [11000, 14500, 17500, 16000, 22000, 20000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
  ],
};

// Charges status data
export const chargesStatusData = {
  labels: ['Pagas', 'Pendentes', 'Atrasadas'],
  datasets: [
    {
      data: [75, 15, 10],
      backgroundColor: [
        '#10b981', // Success green
        '#f97316', // Warning orange
        '#ef4444', // Danger red
      ],
      borderColor: [
        '#10b981',
        '#f97316',
        '#ef4444',
      ],
      borderWidth: 1,
    },
  ],
};

// Recent clients
export const recentClients = [
  {
    id: 1,
    name: 'Empresa ABC Ltda',
    email: 'contato@empresaabc.com.br',
    phone: '(11) 3456-7890',
    status: 'active',
    lastInvoice: {
      amount: 1750.00,
      date: '2023-05-15',
      status: 'paid',
    },
  },
  {
    id: 2,
    name: 'Tech Solutions SA',
    email: 'financeiro@techsolutions.com',
    phone: '(21) 2345-6789',
    status: 'active',
    lastInvoice: {
      amount: 2930.00,
      date: '2023-06-01',
      status: 'pending',
    },
  },
  {
    id: 3,
    name: 'Indústria XYZ',
    email: 'contato@industriaxyz.com.br',
    phone: '(41) 3456-7890',
    status: 'inactive',
    lastInvoice: {
      amount: 5600.00,
      date: '2023-04-22',
      status: 'overdue',
    },
  },
  {
    id: 4,
    name: 'Comércio Rápido Ltda',
    email: 'financeiro@comerciorapido.com.br',
    phone: '(31) 2345-6789',
    status: 'active',
    lastInvoice: {
      amount: 1200.00,
      date: '2023-05-28',
      status: 'paid',
    },
  },
  {
    id: 5,
    name: 'Construtora Futuro',
    email: 'pagamentos@construtorafuturo.com.br',
    phone: '(51) 3456-7890',
    status: 'active',
    lastInvoice: {
      amount: 8900.00,
      date: '2023-06-05',
      status: 'paid',
    },
  },
];

// Upcoming charges
export const upcomingCharges = [
  {
    id: 101,
    client: 'Empresa ABC Ltda',
    amount: 2150.00,
    dueDate: '2023-06-15',
    invoiceNumber: 'INV-2023-0145',
  },
  {
    id: 102,
    client: 'Tech Solutions SA',
    amount: 3430.00,
    dueDate: '2023-06-15',
    invoiceNumber: 'INV-2023-0146',
  },
  {
    id: 103,
    client: 'Supermercados Unidos',
    amount: 1870.00,
    dueDate: '2023-06-15',
    invoiceNumber: 'INV-2023-0147',
  },
];