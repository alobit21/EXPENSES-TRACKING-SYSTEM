import React, { useState } from 'react';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import type{ Goal } from '../../types/goal';

interface ContributionFormProps {
  goal: Goal;
  onClose: () => void;
  onSuccess: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ goal, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { contributeToGoal } = useGoals();

  const remainingAmount = goal.targetAmount - goal.currentAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contributionAmount = parseFloat(amount);
    if (contributionAmount <= 0) {
      alert('Please enter a positive amount');
      return;
    }

    if (contributionAmount > remainingAmount) {
      alert(`You can contribute at most $${remainingAmount.toFixed(2)} to reach your goal`);
      return;
    }

    try {
      setIsSubmitting(true);
      await contributeToGoal(goal.id, contributionAmount);
      onSuccess();
    } catch (error) {
      console.error('Error contributing to goal:', error);
      alert('Error contributing to goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-xl font-semibold text-gray-800">Contribute to Goal</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
        aria-label="Close"
        disabled={isSubmitting}
      >
        <X size={24} />
      </button>
    </div>

    <div className="p-6 space-y-6">
      {/* Goal Overview */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">{goal.title}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Current: </span>
            <span className="font-semibold">${goal.currentAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600">Target: </span>
            <span className="font-semibold">${goal.targetAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600">Remaining: </span>
            <span className="font-semibold">${remainingAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600">Progress: </span>
            <span className="font-semibold">
              {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Contribution Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Contribution Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              max={remainingAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Max: $${remainingAmount.toFixed(2)}`}
              required
              disabled={isSubmitting}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Maximum allowed: ${remainingAmount.toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp size={16} />
            {isSubmitting ? 'Processing...' : 'Contribute'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default ContributionForm;