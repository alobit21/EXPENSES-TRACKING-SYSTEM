// expense.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseInput } from './dto/input/create-expense.input';
import { UpdateExpenseInput } from './dto/input/update-expense.input';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

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
    
    // If categoryId is provided, find the category
    if (input.categoryId) {
      const foundCategory = await this.categoryRepo.findOne({
        where: { id: input.categoryId, user: { id: user.id } },
      });
      
      if (!foundCategory) {
        throw new Error(`Category with id ${input.categoryId} not found`);
      }
      category = foundCategory;
    }

    // Create the expense - with eager:true, category will be auto-loaded
    const expense = this.repo.create({
      ...input,
      user,
      category, // This can be undefined, which is fine
    });

    // Save and return - no need for findOneOrFail since eager loading will include category
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