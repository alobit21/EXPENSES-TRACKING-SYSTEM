export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface CreateGoalInput {
  title: string;
  targetAmount: number;
  deadline?: string;
}

export interface UpdateGoalInput {
  id: string;
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
}

// Response types
export interface CreateGoalResponse {
  createGoal: Goal;
}

export interface UpdateGoalResponse {
  updateGoal: Goal;
}

export interface DeleteGoalResponse {
  deleteGoal: boolean;
}

export interface ContributeToGoalResponse {
  contributeToGoal: Goal;
}

export interface GetGoalsResponse {
  goals: Goal[];
}

export interface GetGoalResponse {
  goal: Goal;
}