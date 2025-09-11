export interface Category {
  id: string;
  name: string;
  expenses?: Expense[];
  incomes?: Income[];
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  id: string;
  name: string;
}

// Mutation response types
export interface CreateCategoryResponse {
  createCategory: Category;
}

export interface UpdateCategoryResponse {
  updateCategory: Category;
}

export interface DeleteCategoryResponse {
  removeCategory: boolean;
}

// Query response types
export interface GetCategoriesResponse {
  getCategories: Category[];
}

export interface GetCategoryResponse {
  category: Category;
}