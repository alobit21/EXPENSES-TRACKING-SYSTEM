import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class MonthlyAmount {
  @Field()
  month: string; // e.g., '2025-08'
  
  @Field(() => Float)
  total: number;
}

@ObjectType()
export class GoalAlert {
  @Field()
  goalTitle: string;

  @Field(() => Float)
  remainingAmount: number;

  @Field()
  deadline: Date;

  @Field()
  daysLeft: number;
}

@ObjectType()
export class FinanceAnalyticsOutput {
  @Field(() => [MonthlyAmount])
  monthlyIncome: MonthlyAmount[];

  @Field(() => [MonthlyAmount])
  monthlyExpenses: MonthlyAmount[];

  @Field(() => [GoalAlert])
  goalAlerts: GoalAlert[];

  @Field({ nullable: true })
  highExpenseAlert?: string;
}

@ObjectType()
export class MonthlyCategoryExpense {
  @Field()
  month: string; // format YYYY-MM

  @Field()
  categoryName: string;

  @Field(() => Float)
  totalSpent: number;
}

@ObjectType()
export class MonthlyIncomeExpense {
  @Field()
  month: string;

  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpense: number;

  @Field(() => Float)
  netBalance: number; // totalIncome - totalExpense
}
