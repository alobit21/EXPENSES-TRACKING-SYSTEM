import type { Expense } from "./expense";
import type { Goal } from "./goal";
import type { Income } from "./income";

export interface ExpensesByCategory {
  categoryName: string;
  totalAmount: number; // Backend uses totalAmount for financeOverview
}

export interface CategoryExpense {
  categoryName: string;
  totalSpent: number; // Backend uses totalSpent for dashboard
  transactionCount: number;
}

export interface MonthlyExpense {
  month: string;
  totalSpent: number; // Backend uses totalSpent
}

export interface MonthlyAmount {
  month: string;
  total: number; // Backend uses total for analytics
}

export interface GoalAlert {
  goalTitle: string;
  remainingAmount: number;
  deadline: string;
  daysLeft: number;
}

export interface DashboardAlerts {
  highExpenseWarning?: string;
  goalDeadlineWarning?: string;
}

export interface MonthlyIncomeExpense {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

// Response types
export interface FinanceOverviewOutput {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  expensesByCategory: ExpensesByCategory[];
  goals: Goal[];
  recentIncomes: Income[];
  recentExpenses: Expense[];
  alert?: string;
}

export interface FinanceAnalyticsOutput {
  monthlyIncome: MonthlyAmount[];
  monthlyExpenses: MonthlyAmount[];
  goalAlerts: GoalAlert[];
  highExpenseAlert?: string;
}

export interface DashboardOutput {
  totalIncome: number;
  totalExpense: number;
  topCategories: CategoryExpense[];
  monthlyExpenses: MonthlyExpense[];
  goals: Goal[];
  alerts: DashboardAlerts;
}

export interface MonthlyCategoryExpense {
  month: string;
  categoryName: string;
  totalSpent: number;
}

// Response interfaces
export interface FinanceOverviewResponse {
  financeOverview: FinanceOverviewOutput;
}

export interface FinanceAnalyticsResponse {
  financeAnalytics: FinanceAnalyticsOutput;
}

export interface DashboardResponse {
  dashboard: DashboardOutput;
}

export interface MonthlyCategoryExpensesResponse {
  monthlyCategoryExpenses: MonthlyCategoryExpense[];
}

export interface MonthlyIncomeExpenseResponse {
  monthlyIncomeExpense: MonthlyIncomeExpense[];
}


export const ReportType ={
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY:'MONTHLY',
  YEARLY :'YEARLY',
  CUSTOM:'CUSTOM'
} as const;
export type ReportType = typeof ReportType[keyof typeof ReportType];

export interface CategoryBreakdown {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

export interface TransactionItem {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
}

export interface CustomReportOutput {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  topTransactions: TransactionItem[];
}

export interface CustomReportResponse {
  customReport: CustomReportOutput;
}