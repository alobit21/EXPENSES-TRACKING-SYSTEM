import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GET_MONTHLY_INCOME_EXPENSE } from '../../api/finance/queries';
import { useQuery } from '@apollo/client/react';
import { DollarSign } from 'lucide-react';

interface MonthlyIncomeExpenseData {
  monthlyIncomeExpense: { month: string; totalIncome: number; totalExpense: number; netBalance: number }[];
}

const MonthlyIncomeExpense: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<MonthlyIncomeExpenseData>(GET_MONTHLY_INCOME_EXPENSE, {
    skip: !user,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-600">Please log in to view monthly income vs expense.</p>
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

  const { monthlyIncomeExpense } = data!;
  const totalPages = Math.ceil(monthlyIncomeExpense.length / rowsPerPage);

  // Get most recent rows first
  const sortedData = [...monthlyIncomeExpense].reverse();

  // Paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-1 sm:px-2 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="md:text-3xl text-xl font-extrabold text-gray-900 tracking-tight">Monthly Income vs Expense</h2>
          <p className="mt-2 text-lg text-gray-600">Track your financial performance over time</p>
        </div>

        {monthlyIncomeExpense.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300 animate-bounce" />
            <p className="text-lg font-medium text-gray-600">No data found</p>
            <p className="text-sm text-gray-500">Add income or expense records to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-semibold text-sm">
                    <th className="p-4 text-left">Month</th>
                    <th className="p-4 text-left">Income</th>
                    <th className="p-4 text-left">Expense</th>
                    <th className="p-4 text-left">Net Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((item) => (
                    <tr
                      key={item.month}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-4 text-gray-700">{item.month}</td>
                      <td className="p-4 text-green-600 font-semibold">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          ${item.totalIncome.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4 text-red-600 font-semibold">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          ${item.totalExpense.toFixed(2)}
                        </div>
                      </td>
                      <td
                        className={`p-4 font-semibold ${
                          item.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          ${item.netBalance.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyIncomeExpense;
