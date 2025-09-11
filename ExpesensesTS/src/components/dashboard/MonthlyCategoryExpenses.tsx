import { useQuery } from '@apollo/client/react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GET_MONTHLY_CATEGORY_EXPENSES } from '../../api/finance/queries';
import { DollarSign } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyCategoryExpensesData {
  monthlyCategoryExpenses: { month: string; categoryName: string; totalSpent: number }[];
}

// Utility function to generate random colors for pie chart
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MonthlyCategoryExpenses: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<MonthlyCategoryExpensesData>(GET_MONTHLY_CATEGORY_EXPENSES, {
    skip: !user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-600">Please log in to view monthly category expenses.</p>
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

  const { monthlyCategoryExpenses } = data!;
  const months = [...new Set(monthlyCategoryExpenses.map((expense) => expense.month))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-1 sm:px-1 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <h2 className="md:text-3xl text-xl  font-extrabold text-gray-900 tracking-tight">Monthly Category Expenses</h2>
          <p className="mt-2 text-lg text-gray-600">Breakdown of expenses by category and month</p>
        </div>

        {months.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300 animate-bounce" />
            <p className="text-lg font-medium text-gray-600">No expenses found</p>
            <p className="text-sm text-gray-500">Add expenses to see category breakdowns!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {months.map((month) => {
              const monthExpenses = monthlyCategoryExpenses.filter((expense) => expense.month === month);
              const chartData = {
                labels: monthExpenses.map((expense) => expense.categoryName),
                datasets: [
                  {
                    data: monthExpenses.map((expense) => expense.totalSpent),
                    backgroundColor: monthExpenses.map(() => generateRandomColor()),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                  },
                ],
              };
              const chartOptions = {
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: $${value.toFixed(2)}`;
                      },
                    },
                  },
                },
                maintainAspectRatio: false,
              };

              return (
                <div key={month} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <DollarSign size={24} className="text-red-500" />
                    {month}
                  </h3>
                  
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Chart on the LEFT side */}
                    <div className="w-full lg:w-1/2 h-64">
                      <Pie data={chartData} options={chartOptions} />
                    </div>
                    
                    {/* Category list on the RIGHT side */}
                    <div className="w-full lg:w-1/2">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Category Breakdown</h4>
                      <ul className="space-y-3">
                        {monthExpenses.map((expense) => (
                          <li
                            key={`${expense.month}-${expense.categoryName}`}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <span className="text-gray-700">{expense.categoryName}</span>
                            <span className="text-red-600 font-semibold">${expense.totalSpent.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCategoryExpenses;