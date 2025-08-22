// src/finance/finance.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceOverviewOutput } from './dto/output/finance-overview.output';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { FinanceAnalyticsOutput, MonthlyCategoryExpense, MonthlyIncomeExpense } from './dto/output/finance-analytics.output';
import { DashboardOutput } from './dto/output/dashboard.output';

@Resolver()
export class FinanceResolver {
  constructor(private readonly financeService: FinanceService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => FinanceOverviewOutput)
  async financeOverview(@CurrentUser() user: User) {
    return this.financeService.getFinanceOverview(user);
  }

@UseGuards(GqlJwtAuthGuard)
@Query(() => FinanceAnalyticsOutput)
async financeAnalytics(@CurrentUser() user: User) {
  return this.financeService.getFinanceAnalytics(user);
}

@UseGuards(GqlJwtAuthGuard)
@Query(() => DashboardOutput)
  async dashboard(@CurrentUser() user: User) {
    return this.financeService.getDashboard(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [MonthlyCategoryExpense])
  async monthlyCategoryExpenses(@CurrentUser() user: User) {
    return this.financeService.getMonthlyCategoryExpenses(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [MonthlyIncomeExpense])
  async monthlyIncomeExpense(@CurrentUser() user: User) {
    return this.financeService.getMonthlyIncomeExpense(user);
  }

}
