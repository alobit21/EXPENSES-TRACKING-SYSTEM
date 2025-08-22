// resolver/goal.mutation.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GoalService } from '../goal.service';
import { GoalOutput } from '../dto/output/goal.output';
import { CreateGoalInput } from '../dto/input/create-goal.input';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { UpdateGoalInput } from '../dto/input/update-goal.input';

@Resolver(() => GoalOutput)
export class GoalMutations {
    constructor(private readonly goalService: GoalService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => GoalOutput)
  createGoal(
    @Args('input') input: CreateGoalInput,
    @CurrentUser() user: User,
  ) {
    return this.goalService.create(user, input);
  }

    @UseGuards(GqlJwtAuthGuard)
    @Mutation(() => GoalOutput)
    updateGoal(
        @Args('input') input: UpdateGoalInput,
        @CurrentUser() user: User,
    ) {
        return this.goalService.update(user, input);
    }


  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  deleteGoal(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.goalService.remove(user, id);
  }

    @UseGuards(GqlJwtAuthGuard)
    @Mutation(() => GoalOutput)
    contributeToGoal(
        @Args('goalId') goalId: string,
        @Args('amount') amount: number,
        @CurrentUser() user: User,
    ) {
        return this.goalService.contributeToGoal(user, goalId, amount);
    }
}
