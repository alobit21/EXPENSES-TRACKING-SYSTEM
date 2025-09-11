import { gql } from '@apollo/client';

export const CREATE_GOAL = gql`
  mutation CreateGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      id
      title
      targetAmount
      currentAmount
      deadline
    }
  }
`;

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($input: UpdateGoalInput!) {
    updateGoal(input: $input) {
      id
      title
      targetAmount
      currentAmount
      deadline
    }
  }
`;

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: String!) {
    deleteGoal(id: $id)
  }
`;

export const CONTRIBUTE_TO_GOAL = gql`
  mutation ContributeToGoal($goalId: String!, $amount: Float!) {
    contributeToGoal(goalId: $goalId, amount: $amount) {
      id
      title
      targetAmount
      currentAmount
      deadline
    }
  }
`;