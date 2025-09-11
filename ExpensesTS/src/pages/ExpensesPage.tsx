import React from 'react';
import ExpenseList from '../components/expenses/ExpenseList';

const ExpensesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExpenseList />
    </div>
  );
};

export default ExpensesPage;