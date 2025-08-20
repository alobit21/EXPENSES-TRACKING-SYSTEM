// expense.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseInput } from './dto/input/create-expense.input';
import { UpdateExpenseInput } from './dto/input/update-expense.input';
import { User } from '../user/user.entity';

@Injectable()
export class ExpenseService {
  constructor(@InjectRepository(Expense) private repo: Repository<Expense>) {}

  async create(user: User, input: CreateExpenseInput): Promise<Expense> {
    const expense = this.repo.create({ ...input, user });
    return this.repo.save(expense);
  }

async update(user: User, input: UpdateExpenseInput): Promise<Expense> {
  const expense = await this.repo.findOne({
    where: { id: input.id, user: { id: user.id } },
  });

  if (!expense) {
    throw new Error(`Expense with id ${input.id} not found`);
  }

  this.repo.merge(expense, input); // safer than Object.assign
  return this.repo.save(expense);
}


  async findAll(user: User): Promise<Expense[]> {
    return this.repo.find({ where: { user: { id: user.id } } });
  }

async findOne(user: User, id: string): Promise<Expense> {
  const expense = await this.repo.findOne({
    where: { id, user: { id: user.id } },
    relations: ['category', 'user'],
  });

  if (!expense) {
    throw new Error(`Expense with ID ${id} not found for this user`);
  }

  return expense;
}

}


