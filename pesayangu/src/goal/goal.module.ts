// goal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { GoalService } from './goal.service';
import { GoalMutations } from './resolver/goal.mutation';
import { GoalQueries } from './resolver/goal.query';
import { Expense } from 'src/expense/expense.entity';
import { Income } from 'src/income/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal,Expense,Income])],
  providers: [GoalService, GoalMutations, GoalQueries],
})
export class GoalModule {}
