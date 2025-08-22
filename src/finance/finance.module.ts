// src/finance/finance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceResolver } from './finance.resolver';
import { Income } from '../income/income.entity';
import { Expense } from '../expense/expense.entity';
import { Goal } from '../goal/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Expense, Goal])],
  providers: [FinanceService, FinanceResolver],
})
export class FinanceModule {}
