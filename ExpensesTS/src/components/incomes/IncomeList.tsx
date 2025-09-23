import React, { useState, useMemo } from 'react';
import { Trash2, Edit, Plus, DollarSign, Calendar } from 'lucide-react';
import { useIncomes } from '../../hooks/useIncomes';
import type { Income } from '../../types/income';
import { format, startOfMonth } from 'date-fns';
import IncomeForm from './IncomeForm';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const IncomeList: React.FC = () => {
  const { incomes, loading, error, deleteIncome } = useIncomes();
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'description' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const pageSize = 10;

  // Summary calculations
  const totalIncome = useMemo(() => incomes.reduce((sum, income) => sum + income.amount, 0), [incomes]);
  const incomeCount = incomes.length;
  const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
  const maxIncome = incomes.length > 0 ? Math.max(...incomes.map((i) => i.amount)) : 0;

  // Chart data
  const barChartData = useMemo(() => {
    const monthly = incomes.reduce<Record<string, number>>((acc, income: Income) => {
      const monthKey = format(startOfMonth(new Date(income.date)), 'yyyy-MM');
      acc[monthKey] = (acc[monthKey] ?? 0) + income.amount;
      return acc;
    }, {});
    return Object.entries(monthly).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month));
  }, [incomes]);

  const pieChartData = useMemo(() => {
    const byDescription = incomes.reduce<Record<string, number>>((acc, income: Income) => {
      const key = income.description || 'No Description';
      acc[key] = (acc[key] ?? 0) + income.amount;
      return acc;
    }, {});
    return Object.entries(byDescription).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [incomes]);

  // Chart colors
  const COLORS = darkMode
    ? ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#F472B6', '#9CA3AF']
    : ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  // Filter & sort
  const filteredIncomes = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return incomes.filter((income) => {
      return (
        (income.description || '').toLowerCase().includes(lowerSearch) ||
        income.amount.toString().includes(lowerSearch) ||
        format(new Date(income.date), 'MMM dd, yyyy').toLowerCase().includes(lowerSearch)
      );
    });
  }, [incomes, searchTerm]);

  const sortedIncomes = useMemo(() => {
    return [...filteredIncomes].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'amount') comparison = a.amount - b.amount;
      else if (sortBy === 'description') comparison = (a.description || '').localeCompare(b.description || '');
      else if (sortBy === 'date') comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [filteredIncomes, sortBy, sortDir]);

  const totalPages = Math.ceil(sortedIncomes.length / pageSize);
  const paginatedIncomes = sortedIncomes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(column);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full mx-auto p-1 sm:p-1 lg:p-8 transition-colors duration-300">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow z-50"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-300 animate-pulse">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            Loading incomes...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 dark:bg-red-900 rounded-lg p-4">
            Error: {error.message}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl ml-2 font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">
                  Incomes
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Track and manage your income effortlessly
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
              >
                <Plus size={20} />
                Add Income
              </button>
            </div>

            {/* Charts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Income Analysis</h2>
              {barChartData.length > 0 || pieChartData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly Income Trends</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                          <XAxis
                            dataKey="month"
                            stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                            fontSize={10}
                            tickLine={false}
                            axisLine={{ stroke: darkMode ? '#374151' : '#D1D5DB', strokeWidth: 1 }}
                          />
                          <YAxis
                            stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                            fontSize={10}
                            tickLine={false}
                            axisLine={{ stroke: darkMode ? '#374151' : '#D1D5DB', strokeWidth: 1 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
                              borderRadius: '8px',
                              border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              color: darkMode ? '#F9FAFB' : '#111827',
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', color: darkMode ? '#F9FAFB' : '#111827' }} />
                          <Bar
                            dataKey="amount"
                            fill={COLORS[0]}
                            fillOpacity={0.6}
                            stroke={COLORS[0]}
                            strokeWidth={1}
                            barSize={16}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Income Distribution by Description</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fillOpacity={0.8}
                          >
                            {pieChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={darkMode ? '#1F2937' : '#fff'} strokeWidth={1} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
                              borderRadius: '8px',
                              border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              color: darkMode ? '#F9FAFB' : '#111827',
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                          />
                          <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                            wrapperStyle={{ fontSize: '10px', marginTop: '10px', color: darkMode ? '#F9FAFB' : '#111827' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No data available for charts</p>
              )}
            </div>

            {/* Table & Summary */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Table */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search by description, amount, or date..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                  />
                </div>

                {/* Table headers */}
                <div className="min-w-[600px] grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                  >
                    Amount {sortBy === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('description')}
                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                  >
                    Description {sortBy === 'description' && (sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                  >
                    Date {sortBy === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                  <div>Actions</div>
                </div>

                {/* Table rows */}
                <div className="min-w-[600px]">
                  {paginatedIncomes.map((income) => (
                    <div
                      key={income.id}
                      className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <DollarSign size={16} />
                        ${income.amount.toFixed(2)}
                      </div>
                      <div className="text-gray-700 dark:text-gray-200">{income.description || 'No description'}</div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar size={16} />
                        {format(new Date(income.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingIncome(income)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 transition-colors"
                          aria-label="Edit income"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this income?')) {
                              deleteIncome(income.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 transition-colors"
                          aria-label="Delete income"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="w-full lg:w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Income Summary
                </h2>

                <div className="space-y-4">
                  {[
                    { label: 'Total Income', value: `$${totalIncome.toFixed(2)}`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/50' },
                    { label: 'Number of Incomes', value: incomeCount, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/50' },
                    { label: 'Average Income', value: `$${averageIncome.toFixed(2)}`, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/50' },
                    { label: 'Highest Income', value: `$${maxIncome.toFixed(2)}`, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/50' },
                  ].map((item, index) => (
                    <div key={index} className={`${item.bg} p-4 rounded-xl border border-white/50 dark:border-gray-700/50`}>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{item.label}</div>
                      <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Updated just now</span>
                    <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium">
                      View Report →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Income Forms */}
            {showForm && (
              <IncomeForm
                income={null}
                onClose={() => {
                  setShowForm(false);
                  setEditingIncome(null);
                }}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingIncome(null);
                }}
              />
            )}
            {editingIncome?.id && (
              <IncomeForm
                income={editingIncome}
                onClose={() => setEditingIncome(null)}
                onSuccess={() => setEditingIncome(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
