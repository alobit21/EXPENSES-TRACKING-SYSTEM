import React from 'react';
import GoalList from '../components/goals/GoalList';

const GoalsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GoalList />
    </div>
  );
};

export default GoalsPage;