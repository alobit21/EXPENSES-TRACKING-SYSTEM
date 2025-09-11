// resolver/goal.query.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GoalOutput } from '../dto/output/goal.output';
import { GoalService } from '../goal.service';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Resolver(() => GoalOutput)
export class GoalQueries {
  constructor(private readonly goalService: GoalService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [GoalOutput])
  goals(@CurrentUser() user: User) {
    return this.goalService.findAll(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => GoalOutput)
  goal(@Args('id') id: string, @CurrentUser() user: User) {
    return this.goalService.findOne(user, id);
  }
}
