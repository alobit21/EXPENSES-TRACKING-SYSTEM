import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Income } from '../income.entity';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { IncomeService } from '../income.service';
 
@Resolver(() => Income)
export class IncomeQueries {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Income])
  incomes(@CurrentUser() user: User) {
    return this.incomeService.findAll(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => Income)
  income(@Args('id') id: string, @CurrentUser() user: User) {
    return this.incomeService.findOne(user, id);
  }
}
