import React, { useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GET_MONTHLY_INCOME_EXPENSE } from '../api/finance/queries';
import { downloadCSV, downloadJSON, downloadPDF } from '../utils/downloadReport';
import DownloadButton from './DownloadButton';

interface MonthlyIncomeExpenseData {
  monthlyIncomeExpense: { month: string; totalIncome: number; totalExpense: number; netBalance: number }[];
}

const MonthlyIncomeExpense: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<MonthlyIncomeExpenseData>(GET_MONTHLY_INCOME_EXPENSE, {
    skip: !user,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      await downloadPDF(reportRef.current, {
        filename: 'monthly-income-expense',
        title: 'Monthly Income vs Expense Report',
        subtitle: 'Track your financial performance over time',
      });
    }
  };

  const handleDownloadCSV = () => {
    if (data?.monthlyIncomeExpense) {
      downloadCSV(data.monthlyIncomeExpense, 'monthly-income-expense');
    }
  };

  const handleDownloadJSON = () => {
    if (data?.monthlyIncomeExpense) {
      downloadJSON(data.monthlyIncomeExpense, 'monthly-income-expense');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-600 dark:text-gray-300">Please log in to view monthly income vs expense.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-600 dark:text-gray-300 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-red-500 dark:text-red-400">Error: {error.message}</p>
      </div>
    );
  }

  const { monthlyIncomeExpense } = data!;
  const totalIncome = monthlyIncomeExpense.reduce((sum, item) => sum + item.totalIncome, 0);
  const totalExpense = monthlyIncomeExpense.reduce((sum, item) => sum + item.totalExpense, 0);
  const totalNetBalance = monthlyIncomeExpense.reduce((sum, item) => sum + item.netBalance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Monthly Income vs Expense Report
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Track your financial performance over time</p>
          </div>

          <DownloadButton
            onDownloadPDF={handleDownloadPDF}
            onDownloadCSV={handleDownloadCSV}
            onDownloadJSON={handleDownloadJSON}
            isLoading={loading}
          />
        </div>

        <div ref={reportRef}>
          {monthlyIncomeExpense.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-400 animate-bounce" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No data found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add income or expense records to get started!</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Income</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-200">${totalIncome.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-200">${totalExpense.toFixed(2)}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border ${
                    totalNetBalance >= 0
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700'
                      : 'bg-orange-50 border-orange-200 dark:bg-orange-900 dark:border-orange-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Net Balance</p>
                      <p
                        className={`text-2xl font-bold ${
                          totalNetBalance >= 0 ? 'text-blue-700 dark:text-blue-200' : 'text-orange-700 dark:text-orange-200'
                        }`}
                      >
                        ${totalNetBalance.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                        <th className="p-4 text-left">Month</th>
                        <th className="p-4 text-left">Income</th>
                        <th className="p-4 text-left">Expense</th>
                        <th className="p-4 text-left">Net Balance</th>
                        <th className="p-4 text-left">Savings Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyIncomeExpense.map((item) => {
                        const savingsRate =
                          item.totalIncome > 0 ? ((item.netBalance / item.totalIncome) * 100).toFixed(1) : '0.0';

                        return (
                          <tr
                            key={item.month}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                          >
                            <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{item.month}</td>
                            <td className="p-4 text-green-600 dark:text-green-400 font-semibold">
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} />
                                ${item.totalIncome.toFixed(2)}
                              </div>
                            </td>
                            <td className="p-4 text-red-600 dark:text-red-400 font-semibold">
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} />
                                ${item.totalExpense.toFixed(2)}
                              </div>
                            </td>
                            <td
                              className={`p-4 font-semibold ${
                                item.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} />
                                ${item.netBalance.toFixed(2)}
                              </div>
                            </td>
                            <td
                              className={`p-4 font-semibold ${
                                parseFloat(savingsRate) >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {savingsRate}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeExpense;
