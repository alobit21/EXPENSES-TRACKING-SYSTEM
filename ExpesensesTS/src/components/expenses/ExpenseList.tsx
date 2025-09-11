import React from 'react';
import { Trash2, Edit, Plus, DollarSign, Calendar, Tag, CreditCard, Wallet } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { PaymentMethod, type Expense } from '../../types/expense';
import { format, subDays } from 'date-fns';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ExpenseForm from './ExpenseForm';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseList: React.FC = () => {
  const { expenses, loading, error, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  // Calculate summary metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    const category = expense.category?.name || 'Uncategorized';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Budget (for demo purposes, assuming $1000 monthly budget)
  const monthlyBudget = 1000;
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;

  // Pie chart data for category breakdown
  const pieChartData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Bar chart data for expenses over the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), i), 'MMM dd')
  ).reverse();
  const barChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily Expenses',
        data: last7Days.map((day) =>
          expenses
            .filter((exp) => format(new Date(exp.date), 'MMM dd') === day)
            .reduce((sum, exp) => sum + exp.amount, 0)
        ),
        backgroundColor: '#FF6B6B',
        borderColor: '#FF4D4D',
        borderWidth: 1,
      },
    ],
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CreditCard size={16} className="text-blue-500" />;
      case PaymentMethod.CASH:
        return <Wallet size={16} className="text-green-500" />;
      case PaymentMethod.MOBILE_PAYMENT:
        return <Wallet size={16} className="text-purple-500" />;
      case PaymentMethod.BANK_TRANSFER:
        return <Wallet size={16} className="text-indigo-500" />;
      default:
        return <Wallet size={16} className="text-gray-500" />;
    }
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    return method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-xl text-gray-600 animate-pulse">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-xl text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Expense Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">Track and manage your expenses</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <DollarSign size={32} className="text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <DollarSign size={32} className="text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Average Expense</h3>
                <p className="text-2xl font-bold text-gray-900">${averageExpense.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <Tag size={32} className="text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(categoryBreakdown).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Budget</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Budget Used: {budgetUsed.toFixed(1)}%</span>
              <span className="text-sm font-medium text-gray-600">${totalExpenses.toFixed(2)} / ${monthlyBudget}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense by Category</h3>
            <div className="h-64">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: $${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses Over Time</h3>
            <div className="h-64">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Amount ($)' } },
                    x: { title: { display: true, text: 'Date' } },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 text-sm">
            <div>Amount</div>
            <div>Description</div>
            <div>Date</div>
            <div>Category</div>
            <div className="hidden md:block">Payment Method</div>
            <div className="hidden sm:block">Actions</div>
          </div>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <DollarSign size={16} />
                ${expense.amount.toFixed(2)}
              </div>
              <div className="text-gray-700 truncate">{expense.description || 'No description'}</div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                {expense.category ? (
                  <>
                    <Tag size={16} className="text-blue-500" />
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {expense.category.name}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs">No category</span>
                )}
              </div>
              <div className="hidden md:flex items-center gap-2">
                {getPaymentMethodIcon(expense.paymentMethod)}
                <span className="text-xs text-gray-600">{getPaymentMethodText(expense.paymentMethod)}</span>
              </div>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  aria-label="Edit expense"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      deleteExpense(expense.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Delete expense"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {expenses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300 animate-bounce" />
            <p className="text-lg font-medium text-gray-600">No expenses found</p>
            <p className="text-sm text-gray-500">Add your first expense to get started!</p>
          </div>
        )}

        {/* Expense Form Modals */}
        {showForm && (
          <ExpenseForm
            expense={null}
            onClose={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}
        {editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSuccess={() => setEditingExpense(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseList;