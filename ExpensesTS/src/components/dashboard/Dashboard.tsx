import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GET_DASHBOARD } from '../../api/finance/queries';
import { useQuery } from '@apollo/client/react';
import { DollarSign, Tag, AlertTriangle } from 'lucide-react';

interface DashboardData {
  dashboard: {
    totalIncome: number;
    totalExpense: number;
    topCategories: { categoryName: string; totalSpent: number; transactionCount: number }[];
    monthlyExpenses: { month: string; totalSpent: number }[];
    goals: { id: string; title: string; targetAmount: number; currentAmount: number; deadline: string }[];
    alerts: { highExpenseWarning?: string; goalDeadlineWarning?: string };
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<DashboardData>(GET_DASHBOARD, {
    skip: !user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const { dashboard } = data!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Dashboard</h2>
          <p className="mt-2 text-lg text-gray-600">Overview of your financial status</p>
        </div>

        {/* Alerts */}
        {(dashboard.alerts.highExpenseWarning || dashboard.alerts.goalDeadlineWarning) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-yellow-500" />
              Alerts
            </h3>
            {dashboard.alerts.highExpenseWarning && (
              <p className="text-red-500 mb-2">{dashboard.alerts.highExpenseWarning}</p>
            )}
            {dashboard.alerts.goalDeadlineWarning && (
              <p className="text-orange-500">{dashboard.alerts.goalDeadlineWarning}</p>
            )}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <DollarSign size={32} className="text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Income</h3>
                <p className="text-2xl font-bold text-gray-900">${dashboard.totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <DollarSign size={32} className="text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-900">${dashboard.totalExpense.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <Tag size={32} className="text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Top Categories</h3>
                <p className="text-2xl font-bold text-gray-900">{dashboard.topCategories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag size={24} className="text-blue-500" />
            Top Categories
          </h3>
          {dashboard.topCategories.length === 0 ? (
            <p className="text-gray-500 text-center">No categories found</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.topCategories.map((cat) => (
                <li
                  key={cat.categoryName}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-gray-700">{cat.categoryName}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-red-600 font-semibold">${cat.totalSpent.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">({cat.transactionCount} transactions)</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-red-500" />
            Monthly Expenses
          </h3>
          {dashboard.monthlyExpenses.length === 0 ? (
            <p className="text-gray-500 text-center">No expenses found</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.monthlyExpenses.map((expense) => (
                <li
                  key={expense.month}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-gray-700">{expense.month}</span>
                  <span className="text-red-600 font-semibold">${expense.totalSpent.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-green-500" />
            Financial Goals
          </h3>
          {dashboard.goals.length === 0 ? (
            <p className="text-gray-500 text-center">No goals found</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.goals.map((goal) => (
                <li
                  key={goal.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{goal.title}</span>
                    <span className="text-gray-600 text-sm">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                      <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;