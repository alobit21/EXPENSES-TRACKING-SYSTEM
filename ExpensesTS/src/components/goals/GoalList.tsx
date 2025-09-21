import React from 'react';
import { Trash2, Edit, Plus, Target, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import type { Goal } from '../../types/goal';
import { format } from 'date-fns';
import GoalForm from './GoalForm';
import ContributionForm from './ContributionForm';

const GoalList: React.FC = () => {
  const { goals, loading, error, deleteGoal } = useGoals();
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);
  const [contributingGoal, setContributingGoal] = React.useState<Goal | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const calculateProgress = (goal: Goal): number => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getDaysUntilDeadline = (deadline?: string): number | null => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) return <div className="text-center py-8">Loading goals...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"> */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Financial Goals</h1>
          <p className="text-gray-600 text-sm sm:text-base">{completedGoals} of {totalGoals} goals completed</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
        >
          <Plus size={18} className="sm:size-5" />
          <span className="text-sm sm:text-base">New Goal</span>
        </button>
      </div>

      {/* Forms */}
      {showForm && (
        <GoalForm
          goal={null}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      )}
      {editingGoal && (
        <GoalForm
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
          onSuccess={() => setEditingGoal(null)}
        />
      )}
      {contributingGoal && (
        <ContributionForm
          goal={contributingGoal}
          onClose={() => setContributingGoal(null)}
          onSuccess={() => setContributingGoal(null)}
        />
      )}

      {/* Goals Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
          const isCompleted = progress >= 100;

          return (
            <div
              key={goal.id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Goal Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg break-words pr-2">
                  {goal.title}
                </h3>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    aria-label="Edit goal"
                  >
                    <Edit size={16} className="sm:size-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this goal?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                    aria-label="Delete goal"
                  >
                    <Trash2 size={16} className="sm:size-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">Progress</span>
                  <span className="text-xs sm:text-sm font-semibold">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(progress)}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <DollarSign size={18} className="mx-auto mb-1 text-green-600 sm:size-5" />
                  <div className="text-base sm:text-lg font-bold text-green-600">
                    ${goal.currentAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Saved</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Target size={18} className="mx-auto mb-1 text-blue-600 sm:size-5" />
                  <div className="text-base sm:text-lg font-bold text-blue-600">
                    ${goal.targetAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Target</div>
                </div>
              </div>

              {/* Deadline */}
              {goal.deadline && (
                <div className="flex items-center gap-2 mb-4 p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <Calendar size={14} className="text-orange-600 sm:size-4" />
                  <span className="text-xs sm:text-sm text-orange-700">
                    {daysUntilDeadline && daysUntilDeadline > 0
                      ? `${daysUntilDeadline} days left`
                      : 'Deadline passed'}
                  </span>
                  <span className="text-xs text-orange-600 hidden xs:inline">
                    {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}

              {/* Action Button */}
              {!isCompleted && (
                <button
                  onClick={() => setContributingGoal(goal)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 text-sm sm:text-base"
                >
                  <TrendingUp size={16} className="sm:size-4" />
                  <span>Contribute</span>
                </button>
              )}

              {isCompleted && (
                <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center text-sm sm:text-base">
                  🎉 Goal Achieved!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <Target size={40} className="mx-auto mb-3 text-gray-300 sm:size-12" />
          <p className="text-base sm:text-lg">No goals found</p>
          <p className="text-xs sm:text-sm">Create your first financial goal to get started!</p>
        </div>
      )}
    </div>
  );
};

export default GoalList;