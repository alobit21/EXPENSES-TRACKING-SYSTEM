import { GET_EXPENSES } from '../api/expense/queries';
import { CREATE_EXPENSE, UPDATE_EXPENSE, DELETE_EXPENSE } from '../api/expense/mutations';
import type{
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  CreateExpenseResponse,
  UpdateExpenseResponse,
  DeleteExpenseResponse,
  GetExpensesResponse,
} from '../types/expense';
import { useMutation, useQuery } from '@apollo/client/react';

export const useExpenses = () => {
  const { data, loading, error, refetch } = useQuery<GetExpensesResponse>(GET_EXPENSES);
  
  const [createExpenseMutation] = useMutation<CreateExpenseResponse>(CREATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }],
  });

  const [updateExpenseMutation] = useMutation<UpdateExpenseResponse>(UPDATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }],
  });

  const [deleteExpenseMutation] = useMutation<DeleteExpenseResponse>(DELETE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }],
  });

  const createExpense = async (input: CreateExpenseInput): Promise<Expense | undefined> => {
    try {
      const { data } = await createExpenseMutation({
        variables: { input },
      });
      return data?.createExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  };

  const updateExpense = async (input: UpdateExpenseInput): Promise<Expense | undefined> => {
    try {
      const { data } = await updateExpenseMutation({
        variables: { input },
      });
      return data?.updateExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean | undefined> => {
    try {
      const { data } = await deleteExpenseMutation({
        variables: { id },
      });
      return data?.deleteExpense;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return {
    expenses: data?.expenses || [],
    loading,
    error,
    refetch,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};