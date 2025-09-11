import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
  query Expenses {
    expenses {
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

export const GET_EXPENSE = gql`
  query Expense($id: ID!) {
    expense(id: $id) {
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