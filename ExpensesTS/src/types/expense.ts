export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod: PaymentMethod;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
}

// types/expense.ts
export const PaymentMethod = {
  CASH: 'CASH',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
  BANK_TRANSFER: 'BANK_TRANSFER',
  OTHER: 'OTHER',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];



export interface CreateExpenseInput {
  amount: number;
  description?: string;
  date: string;
  categoryId?: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateExpenseInput {
  id: string;
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
}

// Response types
export interface CreateExpenseResponse {
  createExpense: Expense;
}

export interface UpdateExpenseResponse {
  updateExpense: Expense;
}

export interface DeleteExpenseResponse {
  deleteExpense: boolean;
}

export interface GetExpensesResponse {
  expenses: Expense[];
}

export interface GetExpenseResponse {
  expense: Expense;
}