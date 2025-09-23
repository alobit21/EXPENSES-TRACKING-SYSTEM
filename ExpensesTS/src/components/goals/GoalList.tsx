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
  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Financial Goals</h1>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        {completedGoals} of {totalGoals} goals completed
      </p>
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
  {showForm && <GoalForm goal={null} onClose={() => { setShowForm(false); setEditingGoal(null); }} onSuccess={() => { setShowForm(false); setEditingGoal(null); }} />}
  {editingGoal && <GoalForm goal={editingGoal} onClose={() => setEditingGoal(null)} onSuccess={() => setEditingGoal(null)} />}
  {contributingGoal && <ContributionForm goal={contributingGoal} onClose={() => setContributingGoal(null)} onSuccess={() => setContributingGoal(null)} />}

  {/* Goals Grid */}
  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
    {goals.map((goal) => {
      const progress = calculateProgress(goal);
      const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
      const isCompleted = progress >= 100;

      return (
        <div
          key={goal.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col gap-4"
        >
          {/* Goal Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base sm:text-lg break-words pr-2">
              {goal.title}
            </h3>
            <div className="flex gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => setEditingGoal(goal)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                aria-label="Edit goal"
              >
                <Edit size={16} className="sm:size-4" />
              </button>
              <button
                onClick={() => { if (window.confirm('Are you sure you want to delete this goal?')) deleteGoal(goal.id); }}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                aria-label="Delete goal"
              >
                <Trash2 size={16} className="sm:size-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(progress)}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
            <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <DollarSign size={18} className="mx-auto mb-1 text-green-600 sm:size-5" />
              <div className="text-base sm:text-lg font-bold text-green-600">${goal.currentAmount.toFixed(2)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Saved</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Target size={18} className="mx-auto mb-1 text-blue-600 sm:size-5" />
              <div className="text-base sm:text-lg font-bold text-blue-600">${goal.targetAmount.toFixed(2)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Target</div>
            </div>
          </div>

          {/* Deadline */}
          {goal.deadline && (
            <div className="flex items-center gap-2 mb-3 p-2 sm:p-3 bg-orange-50 dark:bg-orange-900 rounded-lg text-xs sm:text-sm">
              <Calendar size={14} className="text-orange-600 dark:text-orange-400 sm:size-4" />
              <span className="text-orange-700 dark:text-orange-300">
                {daysUntilDeadline && daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
              </span>
              <span className="text-orange-600 dark:text-orange-400 hidden xs:inline">
                {format(new Date(goal.deadline), 'MMM dd, yyyy')}
              </span>
            </div>
          )}

          {/* Action Button */}
          {!isCompleted ? (
            <button
              onClick={() => setContributingGoal(goal)}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-sm sm:text-base"
            >
              <TrendingUp size={16} className="sm:size-4" />
              <span>Contribute</span>
            </button>
          ) : (
            <div className="w-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 py-2 px-4 rounded-lg text-center text-sm sm:text-base">
              🎉 Goal Achieved!
            </div>
          )}
        </div>
      );
    })}
  </div>

  {/* Empty State */}
  {goals.length === 0 && (
    <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
      <Target size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600 sm:size-12" />
      <p className="text-base sm:text-lg">No goals found</p>
      <p className="text-xs sm:text-sm">Create your first financial goal to get started!</p>
    </div>
  )}
</div>


  );
};

export default GoalList;