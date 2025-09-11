import { GET_GOALS } from '../api/goal/queries';
import { CREATE_GOAL, UPDATE_GOAL, DELETE_GOAL, CONTRIBUTE_TO_GOAL } from '../api/goal/mutations';
import type{
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  CreateGoalResponse,
  UpdateGoalResponse,
  DeleteGoalResponse,
  ContributeToGoalResponse,
  GetGoalsResponse
} from '../types/goal';
import { useMutation, useQuery } from '@apollo/client/react';

export const useGoals = () => {
  const { data, loading, error, refetch } = useQuery<GetGoalsResponse>(GET_GOALS);
  
  const [createGoalMutation] = useMutation<CreateGoalResponse>(CREATE_GOAL, {
    refetchQueries: [{ query: GET_GOALS }],
  });

  const [updateGoalMutation] = useMutation<UpdateGoalResponse>(UPDATE_GOAL, {
    refetchQueries: [{ query: GET_GOALS }],
  });

  const [deleteGoalMutation] = useMutation<DeleteGoalResponse>(DELETE_GOAL, {
    refetchQueries: [{ query: GET_GOALS }],
  });

  const [contributeToGoalMutation] = useMutation<ContributeToGoalResponse>(CONTRIBUTE_TO_GOAL, {
    refetchQueries: [{ query: GET_GOALS }],
  });

  const createGoal = async (input: CreateGoalInput): Promise<Goal | undefined> => {
    try {
      const { data } = await createGoalMutation({
        variables: { input },
      });
      return data?.createGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const updateGoal = async (input: UpdateGoalInput): Promise<Goal | undefined> => {
    try {
      const { data } = await updateGoalMutation({
        variables: { input },
      });
      return data?.updateGoal;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string): Promise<boolean | undefined> => {
    try {
      const { data } = await deleteGoalMutation({
        variables: { id },
      });
      return data?.deleteGoal;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  const contributeToGoal = async (goalId: string, amount: number): Promise<Goal | undefined> => {
    try {
      const { data } = await contributeToGoalMutation({
        variables: { goalId, amount },
      });
      return data?.contributeToGoal;
    } catch (error) {
      console.error('Error contributing to goal:', error);
      throw error;
    }
  };

  return {
    goals: data?.goals || [],
    loading,
    error,
    refetch,
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
  };
};