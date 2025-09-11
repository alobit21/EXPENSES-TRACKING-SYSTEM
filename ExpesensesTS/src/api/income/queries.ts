import { gql } from '@apollo/client';

export const GET_INCOMES = gql`
  query Incomes {
    incomes {
      id
      amount
      description
      date
       
    }
  }
`;

export const GET_INCOME = gql`
  query Income($id: ID!) {
    income(id: $id) {
      id
      amount
      description
      date
       
    }
  }
`;