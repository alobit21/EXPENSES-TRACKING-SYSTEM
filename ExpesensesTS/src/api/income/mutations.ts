import { gql } from '@apollo/client';

export const CREATE_INCOME = gql`
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
      id
      amount
      description
      date
       
    }
  }
`;

export const UPDATE_INCOME = gql`
  mutation UpdateIncome($input: UpdateIncomeInput!) {
    updateIncome(input: $input) {
      id
      amount
      description
      date
      
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: String!) {
    deleteIncome(id: $id)
  }
`;