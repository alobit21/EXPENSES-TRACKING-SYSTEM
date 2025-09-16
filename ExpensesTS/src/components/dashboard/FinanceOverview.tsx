import React, { useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GET_FINANCE_OVERVIEW } from '../../api/finance/queries';
import { useQuery } from '@apollo/client/react';
import { DollarSign,AlertTriangle,   } from 'lucide-react';
import GoalsProgress from './GoalsProgress';

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

  // Hooks called at top-level, unconditionally
  const { loading, error, data } = useQuery<FinanceOverviewData>(GET_FINANCE_OVERVIEW, {
    skip: !user,
  });
  const overviewRef = useRef<HTMLDivElement | null>(null);

  // Memoize derived data
  const financeOverview = useMemo(() => {
    return data?.financeOverview ?? {
      totalIncome: 0,
      totalExpenses: 0,
      availableBalance: 0,
      expensesByCategory: [],
      goals: [],
      recentIncomes: [],
      recentExpenses: [],
      alert: undefined,
    };
  }, [data]);

  // Early returns after hooks
  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg text-gray-600 sm:text-xl">Please log in to view your finance overview.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg text-gray-600 animate-pulse sm:text-xl">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg text-red-500 sm:text-xl">Error: {error.message}</p>
      </div>
    );

  // Pre-compute goals progress
  

  return (
    <div ref={overviewRef} className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-2 lg:px-8">
      {/* Header */}
      <div className="text-center md:text-left mb-6">
        <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Finance Overview</h2>
        <p className="mt-1 text-sm sm:text-base md:text-lg text-gray-500">A snapshot of your financial health</p>
      </div>

      {/* Alert */}
      {financeOverview.alert && (
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 border-l-4 border-red-500 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="text-sm font-semibold">Alert</h3>
          </div>
          <p className="text-xs text-red-600 sm:text-sm md:text-base">{financeOverview.alert}</p>
        </div>
      )}

      {/* Summary Cards */}
      
       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-12 sm:gap-2 lg:gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-2 transform hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <DollarSign size={20} className="text-green-600 sm:size-20" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Total Income</h3>
                      <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.totalIncome.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transform hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <DollarSign size={20} className="text-red-600 sm:size-20" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Total Expenses</h3>
                      <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.totalExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transform hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <DollarSign size={20} className="text-blue-600 sm:size-20" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-700 sm:text-lg">Available Balance</h3>
                      <p className="text-lg font-bold text-gray-900 sm:text-2xl">${financeOverview.availableBalance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
        

       <GoalsProgress goals={financeOverview.goals} />

      </div>
    </div>
  );
};

export default FinanceOverview;
