// src/App.tsx
 
import { useAuth } from "../context/AuthContext";
import FinanceOverview from "../report/FinanceOverview";
import MonthlyCategoryExpenses from "../report/MonthlyCategoryExpenses";
import MonthlyIncomeExpense from "../report/MonthlyIncomeExpense";

 

const ReportPage: React.FC = () => {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div>
        <h1>Login</h1>
        <button onClick={() => login('test@example.com', 'password')}>
          Log in (Test)
        </button>
      </div>
    );
  }

  return (
    <div>
       
      {/* <FinanceOverview /> */}
      <MonthlyCategoryExpenses />
      <MonthlyIncomeExpense />
    </div>
  );
};

export default ReportPage;