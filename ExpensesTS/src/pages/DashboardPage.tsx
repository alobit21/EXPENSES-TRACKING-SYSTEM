import FinanceOverview from "../components/dashboard/FinanceOverview";
import MonthlyCategoryExpenses from "../components/dashboard/MonthlyCategoryExpenses";
import MonthlyIncomeExpense from "../components/dashboard/MonthlyIncomeExpense";

 
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="md:text-4xl text-3xl font-extrabold text-gray-900 tracking-tight">Your Financial Hub</h1>
          <p className="mt-2 text-lg text-gray-600">Manage and analyze your finances in one place</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Finance Overview and Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Finance Overview */}
            <div className="bg-white rounded-xl shadow-lg p-1">
              <FinanceOverview />
              <MonthlyCategoryExpenses/>
            </div>

            {/* Dashboard */}
           
          </div>

          {/* Right Column: Monthly Breakdowns */}
          <div className="space-y-6">
            {/* Monthly Income vs Expense */}
            <div className="bg-white rounded-xl shadow-lg p-1">
              <MonthlyIncomeExpense />
            </div>

            {/* Monthly Category Expenses */}
         
          </div>
        </div>
      </div>
    </div>
  );
}

 
