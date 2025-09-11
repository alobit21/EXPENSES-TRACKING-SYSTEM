import { useQuery } from '@apollo/client/react';
import {
  GET_FINANCE_OVERVIEW,
  GET_FINANCE_ANALYTICS,
  GET_DASHBOARD,
  GET_MONTHLY_CATEGORY_EXPENSES,
  GET_MONTHLY_INCOME_EXPENSE
} from '../api/finance/queries';
import type{
  FinanceOverviewResponse,
  FinanceAnalyticsResponse,
  DashboardResponse,
  MonthlyCategoryExpensesResponse,
  MonthlyIncomeExpenseResponse
} from '../types/finance';

export const useFinanceOverview = () => {
  return useQuery<FinanceOverviewResponse>(GET_FINANCE_OVERVIEW);
};

export const useFinanceAnalytics = () => {
  return useQuery<FinanceAnalyticsResponse>(GET_FINANCE_ANALYTICS);
};

export const useDashboard = () => {
  return useQuery<DashboardResponse>(GET_DASHBOARD);
};

export const useMonthlyCategoryExpenses = () => {
  return useQuery<MonthlyCategoryExpensesResponse>(GET_MONTHLY_CATEGORY_EXPENSES);
};

export const useMonthlyIncomeExpense = () => {
  return useQuery<MonthlyIncomeExpenseResponse>(GET_MONTHLY_INCOME_EXPENSE);
};