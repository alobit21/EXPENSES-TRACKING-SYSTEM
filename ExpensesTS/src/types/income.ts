export interface Income {
  id: string;
  amount: number;
  description?: string;
  date: string;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateIncomeInput {
  amount: number;
  description?: string;
  date: string;
}

export interface UpdateIncomeInput {
  id: string;
  amount?: number;
  description?: string;
  date?: string;
}

// Response types
export interface CreateIncomeResponse {
  createIncome: Income;
}

export interface UpdateIncomeResponse {
  updateIncome: Income;
}

export interface DeleteIncomeResponse {
  deleteIncome: boolean;
}

export interface GetIncomesResponse {
  incomes: Income[];
}

export interface GetIncomeResponse {
  income: Income;
}