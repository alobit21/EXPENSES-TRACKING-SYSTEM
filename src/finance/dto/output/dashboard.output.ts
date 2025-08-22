import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { CategoryExpense, MonthlyExpense } from './finance-category-analytics.output';
import { GoalOutput } from 'src/goal/dto/output/goal.output';

@ObjectType()
export class DashboardAlerts {
  @Field({ nullable: true })
  highExpenseWarning?: string;

  @Field({ nullable: true })
  goalDeadlineWarning?: string;
}

@ObjectType()
export class DashboardOutput {
  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpense: number;

  @Field(() => [CategoryExpense])
  topCategories: CategoryExpense[];

  @Field(() => [MonthlyExpense])
  monthlyExpenses: MonthlyExpense[];

  @Field(() => [GoalOutput])
  goals: GoalOutput[];

  @Field(() => DashboardAlerts)
  alerts: DashboardAlerts;
}
