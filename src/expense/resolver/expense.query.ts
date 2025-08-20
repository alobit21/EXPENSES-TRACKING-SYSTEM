// resolver/expense.query.ts
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { ExpenseService } from '../expense.service';
import { UseGuards } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { ExpenseOutput } from '../dto/output/expense.output';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver()
export class ExpenseQuery {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ExpenseOutput])
  expenses(@CurrentUser() user: User) {
    return this.expenseService.findAll(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ExpenseOutput)
  expense(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User) {
    return this.expenseService.findOne(user, id);
  }
}
