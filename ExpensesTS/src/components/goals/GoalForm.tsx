import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, DollarSign } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import type{ Goal, CreateGoalInput } from '../../types/goal';
import { formatDateForInput, isValidDate } from '../../utils/dateFormatter';

interface GoalFormProps {
  goal: Goal | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose, onSuccess }) => {
  const [title, setTitle] = useState(goal?.title || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [deadline, setDeadline] = useState(goal?.deadline ? formatDateForInput(goal.deadline) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');
  
  const { createGoal, updateGoal } = useGoals();

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setTargetAmount(goal.targetAmount?.toString() || '');
      setDeadline(goal.deadline ? formatDateForInput(goal.deadline) : '');
    }
  }, [goal]);

  const validateForm = (): boolean => {
    if (deadline && !isValidDate(deadline)) {
      setDateError('Please enter a valid date');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const goalData = {
        title,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline || undefined,
      };

      setIsSubmitting(true);
      
      if (goal) {
        await updateGoal({ id: goal.id, ...goalData });
      } else {
        await createGoal(goalData as CreateGoalInput);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transition-colors duration-300">
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {goal ? 'Edit Goal' : 'Create Goal'}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Close"
        disabled={isSubmitting}
      >
        <X size={24} />
      </button>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Goal Title
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            placeholder="e.g., New Laptop, Vacation, Emergency Fund"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Target Amount */}
      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Target Amount ($)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
          <input
            type="number"
            id="targetAmount"
            step="0.01"
            min="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            placeholder="1000.00"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Deadline (Optional)
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            disabled={isSubmitting}
          />
        </div>
        {dateError && (
          <p className="text-red-500 text-sm mt-1">{dateError}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title || !targetAmount}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isSubmitting ? 'Saving...' : goal ? 'Update' : 'Create'} Goal
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default GoalForm;