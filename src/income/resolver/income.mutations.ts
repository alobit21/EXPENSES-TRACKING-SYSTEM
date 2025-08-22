import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IncomeService } from '../income.service';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { Income } from '../income.entity';
import { CreateIncomeInput } from '../dto/input/create-income.input';
import { User } from 'src/user/user.entity';
import { UpdateIncomeInput } from '../dto/input/update-income.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
 

@Resolver(() => Income)
export class IncomeMutations {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Income)
  createIncome(
    @Args('input') input: CreateIncomeInput,
    @CurrentUser() user: User,
  ) {
    return this.incomeService.create(user, input);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Income)
  updateIncome(
    @Args('input') input: UpdateIncomeInput,
    @CurrentUser() user: User,
  ) {
    return this.incomeService.update(user, input);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  deleteIncome(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.incomeService.remove(user, id);
  }
}
