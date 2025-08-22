import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class CategoryExpense {
  @Field()
  categoryName: string;

  @Field(() => Float)
  totalSpent: number;

  @Field(() => Int)
  transactionCount: number;
}

@ObjectType()
export class MonthlyExpense {
  @Field()
  month: string; // e.g., "2025-08"

  @Field(() => Float)
  totalSpent: number;
}

@ObjectType()
export class ExpenseAnalyticsOutput {
  @Field(() => [CategoryExpense])
  topCategories: CategoryExpense[];

  @Field(() => [MonthlyExpense])
  monthlyExpenses: MonthlyExpense[];

  @Field(() => Float)
  averageExpense: number;

  @Field(() => Float)
  highestSingleExpense: number;
}
