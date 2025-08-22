// src/finance/dto/output/finance-overview.output.ts
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Expense } from 'src/expense/expense.entity';
import { GoalOutput } from 'src/goal/dto/output/goal.output';
import { Income } from 'src/income/income.entity';

@ObjectType()
export class ExpensesByCategory {
  @Field()
  categoryName: string;

  @Field(() => Float)
  totalAmount: number;
}

@ObjectType()
export class FinanceOverviewOutput {
  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpenses: number;

  @Field(() => Float)
  availableBalance: number;

  @Field(() => [ExpensesByCategory])
  expensesByCategory: ExpensesByCategory[];

  @Field(() => [GoalOutput])
  goals: GoalOutput[];

  @Field(() => [Income])
  recentIncomes: Income[];

  @Field(() => [Expense])
  recentExpenses: Expense[];

  @Field({ nullable: true })
  alert?: string;
}
