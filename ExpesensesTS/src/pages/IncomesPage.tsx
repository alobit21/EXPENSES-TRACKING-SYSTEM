import React from 'react';
import IncomeList from '../components/incomes/IncomeList';

const IncomesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <IncomeList />
    </div>
  );
};

export default IncomesPage;