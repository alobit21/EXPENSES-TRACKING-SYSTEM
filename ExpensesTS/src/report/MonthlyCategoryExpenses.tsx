import { useQuery } from '@apollo/client/react';
import React, { useRef } from 'react';
import { DollarSign } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { GET_MONTHLY_CATEGORY_EXPENSES } from '../api/finance/queries';
import { useAuth } from '../context/AuthContext';
import DownloadButton from './DownloadButton';
import { downloadCSV, downloadJSON, downloadPDF } from '../utils/downloadReport';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyCategoryExpensesData {
  monthlyCategoryExpenses: { month: string; categoryName: string; totalSpent: number }[];
}

const MonthlyCategoryExpenses: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<MonthlyCategoryExpensesData>(GET_MONTHLY_CATEGORY_EXPENSES, {
    skip: !user,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      await downloadPDF(reportRef.current, {
        filename: 'monthly-category-expenses',
        title: 'Monthly Category Expenses Report',
        subtitle: 'Breakdown of expenses by category and month',
      });
    }
  };

  const handleDownloadCSV = () => {
    if (data?.monthlyCategoryExpenses) {
      downloadCSV(data.monthlyCategoryExpenses, 'monthly-category-expenses');
    }
  };

  const handleDownloadJSON = () => {
    if (data?.monthlyCategoryExpenses) {
      downloadJSON(data.monthlyCategoryExpenses, 'monthly-category-expenses');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-600 dark:text-gray-300">Please log in to view monthly category expenses.</p>
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

  const { monthlyCategoryExpenses } = data!;
  const months = [...new Set(monthlyCategoryExpenses.map((expense) => expense.month))];

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Monthly Category Expenses Report
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Breakdown of expenses by category and month
            </p>
          </div>

          <DownloadButton
            onDownloadPDF={handleDownloadPDF}
            onDownloadCSV={handleDownloadCSV}
            onDownloadJSON={handleDownloadJSON}
            isLoading={loading}
          />
        </div>

        <div ref={reportRef}>
          {months.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-400 animate-bounce" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No expenses found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add expenses to see category breakdowns!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {months.map((month) => {
                const monthExpenses = monthlyCategoryExpenses.filter((expense) => expense.month === month);
                const totalMonthSpent = monthExpenses.reduce((sum, exp) => sum + exp.totalSpent, 0);

                const chartData = {
                  labels: monthExpenses.map((expense) => expense.categoryName),
                  datasets: [
                    {
                      data: monthExpenses.map((expense) => expense.totalSpent),
                      backgroundColor: [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
                      ],
                      borderColor: '#ffffff',
                      borderWidth: 2,
                    },
                  ],
                };

                const chartOptions = {
                  plugins: {
                    legend: { position: 'bottom' as const },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const percentage = ((value / totalMonthSpent) * 100).toFixed(1);
                          return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                };

                return (
                  <div key={month} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <DollarSign size={24} className="text-red-500" />
                        {month} - Total: ${totalMonthSpent.toFixed(2)}
                      </h3>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="w-full lg:w-1/2 h-64">
                        <Pie data={chartData} options={chartOptions} />
                      </div>

                      <div className="w-full lg:w-1/2">
                        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Category Breakdown
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthExpenses.map((expense) => {
                                const percentage = ((expense.totalSpent / totalMonthSpent) * 100).toFixed(1);
                                return (
                                  <tr key={`${expense.month}-${expense.categoryName}`} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="p-3 text-gray-700 dark:text-gray-300">{expense.categoryName}</td>
                                    <td className="p-3 text-red-600 font-semibold">${expense.totalSpent.toFixed(2)}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">{percentage}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCategoryExpenses;
