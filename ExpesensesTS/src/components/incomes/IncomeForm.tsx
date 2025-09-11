import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';
import { useIncomes } from '../../hooks/useIncomes';
import type { CreateIncomeInput, Income, UpdateIncomeInput } from '../../types/income';

interface IncomeFormProps {
  income: Income | null;
  onClose: () => void;
  onSuccess: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ income, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(income?.amount?.toString() || '');
  const [description, setDescription] = useState(income?.description || '');
  const [date, setDate] = useState(income?.date ? new Date(income.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createIncome, updateIncome } = useIncomes();

  useEffect(() => {
    if (income) {
      setAmount(income.amount?.toString() || '');
      setDescription(income.description || '');
      setDate(income.date ? new Date(income.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    }
  }, [income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData: CreateIncomeInput | UpdateIncomeInput = {
      amount: parseFloat(amount),
      description: description || undefined,
      date,
    };

    // Add id for updates
    if (income) {
      (incomeData as UpdateIncomeInput).id = income.id;
    }

    setIsSubmitting(true);
    try {
      if (income) {
        await updateIncome(incomeData as UpdateIncomeInput);
      } else {
        await createIncome(incomeData as CreateIncomeInput);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving income:', error);
      alert('Error saving income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {income ? 'Edit Income' : 'Add Income'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Income description"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || !date}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : income ? 'Update' : 'Add'} Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;