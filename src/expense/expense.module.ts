import { Module } from '@nestjs/common';
import { ExpenseMutation } from './resolver/expense.mutation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';

@Module({
    imports:[TypeOrmModule.forFeature([Expense])],
    providers:[ExpenseMutation,ExpenseService],
    exports:[ExpenseMutation]
})
export class ExpenseModule {}
