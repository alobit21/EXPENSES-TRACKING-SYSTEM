import React, { useMemo } from 'react';
import { DollarSign } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals }) => {
  const goalProgress = useMemo(
    () =>
      goals.map((goal) => ({
        ...goal,
        percentComplete: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
      })),
    [goals]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign size={22} className="text-green-500" />
        <h3 className="md:text-2xl lg:text-3xl text-sm font-semibold">Financial Goals</h3>
      </div>

      {goalProgress.length === 0 ? (
        <p className="text-sm text-gray-500">No goals found.</p>
      ) : (
        <div className="space-y-2">
          {goalProgress.map((goal) => (
            <div key={goal.id} className="p-2 bg-gray-50 rounded-md">
              <div className="flex justify-between text-xl md:text-sm lg:text-2xl text-gray-700">
                <span>{goal.title}</span>
                <span>{goal.percentComplete.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${goal.percentComplete}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsProgress;
