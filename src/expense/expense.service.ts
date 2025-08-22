// expense.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseInput } from './dto/input/create-expense.input';
import { UpdateExpenseInput } from './dto/input/update-expense.input';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Income } from 'src/income/income.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) 
    private repo: Repository<Expense>,
    
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

async create(user: User, input: CreateExpenseInput): Promise<Expense> {
  let category: Category | undefined = undefined;

  // Find category if provided
  if (input.categoryId) {
    const foundCategory = await this.categoryRepo.findOne({
      where: { id: input.categoryId, user: { id: user.id } },
    });
    if (!foundCategory) {
      throw new Error(`Category with id ${input.categoryId} not found`);
    }
    category = foundCategory;
  }

  // Calculate total income and expenses
  const totalIncome = await this.repo.manager
    .getRepository(Income)
    .createQueryBuilder("income")
    .where("income.userId = :userId", { userId: user.id })
    .select("SUM(income.amount)", "sum")
    .getRawOne();

  const totalExpenses = await this.repo
    .createQueryBuilder("expense")
    .where("expense.userId = :userId", { userId: user.id })
    .select("SUM(expense.amount)", "sum")
    .getRawOne();

  const currentIncome = Number(totalIncome.sum) || 0;
  const currentExpenses = Number(totalExpenses.sum) || 0;

  if (currentExpenses + input.amount > currentIncome) {
    throw new Error(
      `Cannot create expense of ${input.amount}. Total expenses (${currentExpenses}) would exceed total income (${currentIncome}).`
    );
  }

  // Create and save expense
  const expense = this.repo.create({ ...input, user, category });
  return this.repo.save(expense);
}


  async update(user: User, input: UpdateExpenseInput): Promise<Expense> {
    const expense = await this.repo.findOne({
      where: { id: input.id, user: { id: user.id } },
    });

    if (!expense) {
      throw new Error(`Expense with id ${input.id} not found`);
    }

    // Handle category update if categoryId is provided
    if (input.categoryId !== undefined) {
      let category: Category | undefined = undefined;
      
      if (input.categoryId) {
        const foundCategory = await this.categoryRepo.findOne({
          where: { id: input.categoryId, user: { id: user.id } },
        });
        
        if (!foundCategory) {
          throw new Error(`Category with id ${input.categoryId} not found`);
        }
        category = foundCategory;
      }
      expense.category = category;
    }

    // Merge other input fields
    this.repo.merge(expense, input);
    
    // Save and return - category will be auto-loaded due to eager:true
    return this.repo.save(expense);
  }

  async findAll(user: User): Promise<Expense[]> {
    // With eager:true, no need to specify relations
    return this.repo.find({ 
      where: { user: { id: user.id } },
    });
  }

  async findOne(user: User, id: string): Promise<Expense> {
    // With eager:true, no need to specify relations
    const expense = await this.repo.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!expense) {
      throw new Error(`Expense with ID ${id} not found for this user`);
    }

    return expense;
  }


  async remove(user: User, id: string): Promise<boolean>{
    const expense = await this.repo.findOne({
      where: { id, user: {id: user.id}}
    });

    if (!expense){
      throw new NotFoundException(`Expense with ID ${id} not found for this user` )
    }

    await this.repo.remove(expense);
    return true;
  }
}