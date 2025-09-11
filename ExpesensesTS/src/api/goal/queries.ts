import { gql } from '@apollo/client';

export const GET_GOALS = gql`
  query Goals {
    goals {
      id
      title
      targetAmount
      currentAmount
      deadline
    }
  }
`;

export const GET_GOAL = gql`
  query Goal($id: ID!) {
    goal(id: $id) {
      id
      title
      targetAmount
      currentAmount
      deadline
    }
  }
`;