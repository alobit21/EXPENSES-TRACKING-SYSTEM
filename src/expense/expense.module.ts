import { Module } from '@nestjs/common';
import { ExpenseMutation } from './resolver/expense.mutation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { Category } from 'src/category/category.entity';
import { ExpenseQuery } from './resolver/expense.query';

@Module({
    imports:[TypeOrmModule.forFeature([Expense,Category])],
    providers:[ExpenseMutation,ExpenseService,ExpenseQuery],
    exports:[ExpenseMutation]
})
export class ExpenseModule {}
