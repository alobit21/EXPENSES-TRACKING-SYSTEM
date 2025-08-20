// resolver/expense.mutation.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ExpenseService } from '../expense.service';
import { CreateExpenseInput } from '../dto/input/create-expense.input';
import { UpdateExpenseInput } from '../dto/input/update-expense.input';
import { UseGuards } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { ExpenseOutput } from '../dto/output/expense.output';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver()
export class ExpenseMutation {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ExpenseOutput)
  createExpense(@Args('input') input: CreateExpenseInput, @CurrentUser() user: User) {
    return this.expenseService.create(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ExpenseOutput)
  updateExpense(@Args('input') input: UpdateExpenseInput, @CurrentUser() user: User) {
    return this.expenseService.update(user, input);
  }
}
