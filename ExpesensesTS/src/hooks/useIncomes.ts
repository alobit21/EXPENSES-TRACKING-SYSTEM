import { GET_INCOMES } from '../api/income/queries';
import { CREATE_INCOME, UPDATE_INCOME, DELETE_INCOME } from '../api/income/mutations';
import type{
  Income,
  CreateIncomeInput,
  UpdateIncomeInput,
  CreateIncomeResponse,
  UpdateIncomeResponse,
  DeleteIncomeResponse,
  GetIncomesResponse
} from '../types/income';
import { useMutation, useQuery } from '@apollo/client/react';

export const useIncomes = () => {
  const { data, loading, error, refetch } = useQuery<GetIncomesResponse>(GET_INCOMES);
  
  const [createIncomeMutation] = useMutation<CreateIncomeResponse>(CREATE_INCOME, {
    update: (cache, { data }) => {
      const existingIncomes = cache.readQuery<GetIncomesResponse>({
        query: GET_INCOMES,
      });

      if (data?.createIncome && existingIncomes) {
        cache.writeQuery({
          query: GET_INCOMES,
          data: {
            incomes: [...existingIncomes.incomes, data.createIncome],
          },
        });
      }
    },
  });

  const [updateIncomeMutation] = useMutation<UpdateIncomeResponse>(UPDATE_INCOME, {
    update: (cache, { data }) => {
      const existingIncomes = cache.readQuery<GetIncomesResponse>({
        query: GET_INCOMES,
      });

      if (data?.updateIncome && existingIncomes) {
        cache.writeQuery({
          query: GET_INCOMES,
          data: {
            incomes: existingIncomes.incomes.map(income =>
              income.id === data.updateIncome.id ? data.updateIncome : income
            ),
          },
        });
      }
    },
  });

  const [deleteIncomeMutation] = useMutation<DeleteIncomeResponse>(DELETE_INCOME, {
    update: (cache, { data }, { variables }) => {
      if (data?.deleteIncome) {
        const existingIncomes = cache.readQuery<GetIncomesResponse>({
          query: GET_INCOMES,
        });

        if (existingIncomes) {
          cache.writeQuery({
            query: GET_INCOMES,
            data: {
              incomes: existingIncomes.incomes.filter(
                income => income.id !== variables?.id
              ),
            },
          });
        }
      }
    },
  });

  const createIncome = async (input: CreateIncomeInput): Promise<Income | undefined> => {
    try {
      const { data } = await createIncomeMutation({
        variables: { input },
        optimisticResponse: {
          createIncome: {
            __typename: 'Income',
            id: `temp-${Date.now()}`,
            amount: input.amount,
            description: input.description || '',
            date: input.date,
            // Remove category from optimistic response
          },
        } as CreateIncomeResponse,
      });
      return data?.createIncome;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  };

  const updateIncome = async (input: UpdateIncomeInput): Promise<Income | undefined> => {
    try {
      const { data } = await updateIncomeMutation({
        variables: { input },
        optimisticResponse: {
          updateIncome: {
            __typename: 'Income',
            id: input.id,
            amount: input.amount || 0,
            description: input.description || '',
            date: input.date || new Date().toISOString(),
            // Remove category from optimistic response
          },
        } as UpdateIncomeResponse,
      });
      return data?.updateIncome;
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  };

 const deleteIncome = async (id: string): Promise<boolean | undefined> => {
  try {
    const { data } = await deleteIncomeMutation({
      variables: { id }, // This will now send as String instead of ID
      optimisticResponse: {
        deleteIncome: true,
      } as DeleteIncomeResponse,
    });
    return data?.deleteIncome;
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
};

  return {
    incomes: data?.incomes || [],
    loading,
    error,
    refetch,
    createIncome,
    updateIncome,
    deleteIncome,
  };
};