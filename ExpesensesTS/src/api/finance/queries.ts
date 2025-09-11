
 
 
// src/api/finance/queries.ts
import { gql } from '@apollo/client';

export const GET_FINANCE_OVERVIEW = gql`
  query FinanceOverview {
    financeOverview {
      totalIncome
      totalExpenses
      availableBalance
      expensesByCategory {
        categoryName
        totalAmount
      }
      goals {
        id
        title
        targetAmount
        currentAmount
        deadline
      }
      recentIncomes {
        id
        amount
        date
        description
      }
      recentExpenses {
        id
        amount
        date
        description
        category {
          name
        }
      }
      alert
    }
  }
`;

export const GET_FINANCE_ANALYTICS = gql`
  query FinanceAnalytics {
    financeAnalytics {
      monthlyIncome {
        month
        total
      }
      monthlyExpenses {
        month
        total
      }
      goalAlerts {
        goalTitle
        remainingAmount
        deadline
        daysLeft
      }
      highExpenseAlert
    }
  }
`;

export const GET_DASHBOARD = gql`
  query Dashboard {
    dashboard {
      totalIncome
      totalExpense
      topCategories {
        categoryName
        totalSpent
        transactionCount
      }
      monthlyExpenses {
        month
        totalSpent
      }
      goals {
        id
        title
        targetAmount
        currentAmount
        deadline
      }
      alerts {
        highExpenseWarning
        goalDeadlineWarning
      }
    }
  }
`;

export const GET_MONTHLY_CATEGORY_EXPENSES = gql`
  query MonthlyCategoryExpenses {
    monthlyCategoryExpenses {
      month
      categoryName
      totalSpent
    }
  }
`;

export const GET_MONTHLY_INCOME_EXPENSE = gql`
  query MonthlyIncomeExpense {
    monthlyIncomeExpense {
      month
      totalIncome
      totalExpense
      netBalance
    }
  }
`;