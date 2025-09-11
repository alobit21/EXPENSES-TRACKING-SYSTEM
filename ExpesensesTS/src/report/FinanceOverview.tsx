import React from 'react';
import { DollarSign, Tag, AlertTriangle, Calendar } from 'lucide-react';
import { useQuery } from '@apollo/client/react';

import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GET_FINANCE_OVERVIEW } from '../api/finance/queries';
import { downloadCSV, downloadJSON, downloadPDF } from '../utils/downloadReport';
import DownloadButton from './DownloadButton';

interface FinanceOverviewData {
  financeOverview: {
    totalIncome: number;
    totalExpenses: number;
    availableBalance: number;
    expensesByCategory: { categoryName: string; totalAmount: number }[];
    goals: { id: string; title: string; targetAmount: number; currentAmount: number; deadline: string }[];
    recentIncomes: { id: string; amount: number; date: string; description: string }[];
    recentExpenses: { id: string; amount: number; date: string; description: string; category: { name: string } }[];
    alert?: string;
  };
}

const FinanceOverview: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<FinanceOverviewData>(GET_FINANCE_OVERVIEW, {
    skip: !user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg font-medium text-gray-600 sm:text-xl">Please log in to view your finance overview.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse sm:text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg font-medium text-red-500 sm:text-xl">Error: {error.message}</p>
      </div>
    );
  }

  const reportRef = useRef<HTMLDivElement>(null);

const handleDownloadPDF = async () => {
  if (reportRef.current) {
    await downloadPDF(reportRef.current, {
      filename: 'finance-overview',
      title: 'Finance Overview Report',
      subtitle: 'Complete financial snapshot'
    });
  }
};

const handleDownloadCSV = () => {
  // Convert data to CSV format
  const csvData = [
    // Summary data
    { Metric: 'Total Income', Value: financeOverview.totalIncome },
    { Metric: 'Total Expenses', Value: financeOverview.totalExpenses },
    { Metric: 'Available Balance', Value: financeOverview.availableBalance },
    // Category data
    ...financeOverview.expensesByCategory.map(cat => ({
      Category: cat.categoryName,
      Amount: cat.totalAmount
    }))
  ];
  
  downloadCSV(csvData, 'finance-overview');
};

const handleDownloadJSON = () => {
  downloadJSON(financeOverview, 'finance-overview');
};

  const { financeOverview } = data!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center sm:text-left">
          {/* <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl tracking-tight">Finance Overview</h2>
          <p className="mt-2 text-base text-gray-500 sm:text-lg">A snapshot of your financial health</p> */}
     <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
  {/* Title Section */}
  <div className="flex-1 min-w-0">
    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl tracking-tight truncate">
      Finance Report
    </h2>
    <p className="mt-1 text-base sm:text-lg text-gray-500 truncate">
      A snapshot of your financial health
    </p>
  </div>

  {/* Download Button */}
  <div className="flex-shrink-0">
    <DownloadButton
      onDownloadPDF={handleDownloadPDF}
      onDownloadCSV={handleDownloadCSV}
      onDownloadJSON={handleDownloadJSON}
      isLoading={loading}
    />
  </div>
</div>

        </div>

        {/* Alert */}
        {financeOverview.alert && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-red-500 sm:size-24" />
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Alert</h3>
            </div>
            <p className="text-sm text-red-600 sm:text-base">{financeOverview.alert}</p>
          </div>
        )}
<div ref={reportRef}>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transform hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <DollarSign size={24} className="text-green-600 sm:size-32" />
              <div>
                <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Total Income</h3>
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transform hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <DollarSign size={24} className="text-red-600 sm:size-32" />
              <div>
                <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Total Expenses</h3>
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transform hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <DollarSign size={24} className="text-blue-600 sm:size-32" />
              <div>
                <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Available Balance</h3>
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.availableBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Tag size={20} className="text-blue-500 sm:size-24" />
            <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Expenses by Category</h3>
          </div>
          {financeOverview.expensesByCategory.length === 0 ? (
            <div className="text-center py-8">
              <Tag size={36} className="mx-auto mb-3 text-gray-300 animate-pulse sm:size-48" />
              <p className="text-base font-medium text-gray-600 sm:text-lg">No expenses found</p>
              <p className="text-sm text-gray-500">Add expenses to see category breakdowns!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {financeOverview.expensesByCategory.map((cat) => (
                <div
                  key={cat.categoryName}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-sm text-gray-700 truncate sm:text-base">{cat.categoryName}</span>
                  <span className="text-sm text-red-600 font-medium sm:text-base">${cat.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4 sm:gap-6">
          {/* Recent Incomes */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={20} className="text-green-500 sm:size-24" />
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Recent Incomes</h3>
            </div>
            {financeOverview.recentIncomes.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign size={36} className="mx-auto mb-3 text-gray-300 animate-pulse sm:size-48" />
                <p className="text-base font-medium text-gray-600 sm:text-lg">No recent incomes found</p>
                <p className="text-sm text-gray-500">Add income records to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-medium">
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeOverview.recentIncomes.map((income) => (
                      <tr
                        key={income.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-3 text-gray-700 truncate">{income.description}</td>
                        <td className="p-3 text-green-600 font-medium">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} />
                            ${income.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(income.date).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={20} className="text-red-500 sm:size-24" />
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Recent Expenses</h3>
            </div>
            {financeOverview.recentExpenses.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign size={36} className="mx-auto mb-3 text-gray-300 animate-pulse sm:size-48" />
                <p className="text-base font-medium text-gray-600 sm:text-lg">No recent expenses found</p>
                <p className="text-sm text-gray-500">Add expense records to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-medium">
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeOverview.recentExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-3 text-gray-700 truncate">{expense.description}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                            {expense.category.name}
                          </span>
                        </td>
                        <td className="p-3 text-red-600 font-medium">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} />
                            ${expense.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={20} className="text-green-500 sm:size-24" />
            <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Financial Goals</h3>
          </div>
          {financeOverview.goals.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign size={36} className="mx-auto mb-3 text-gray-300 animate-pulse sm:size-48" />
              <p className="text-base font-medium text-gray-600 sm:text-lg">No goals found</p>
              <p className="text-sm text-gray-500">Set a financial goal to track your progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {financeOverview.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 sm:text-base">{goal.title}</span>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 sm:text-sm mb-1">
                      <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default FinanceOverview;