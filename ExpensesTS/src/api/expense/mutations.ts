import { gql } from '@apollo/client';

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      amount
      description
      date
      paymentMethod
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
      id
      amount
      description
      date
      paymentMethod
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;