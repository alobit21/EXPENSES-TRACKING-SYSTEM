import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { CreateIncomeInput } from './dto/input/create-income.input';
import { UpdateIncomeInput } from './dto/input/update-income.input';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private repo: Repository<Income>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(user: User, input: CreateIncomeInput): Promise<Income> {
    let category;
    if (input.categoryId) {
      category = await this.categoryRepo.findOneBy({ id: input.categoryId });
    }

    const income = this.repo.create({ ...input, user, category });
    return this.repo.save(income);
  }

  async update(user: User, input: UpdateIncomeInput): Promise<Income> {
    const income = await this.repo.findOne({ where: { id: input.id, user: { id: user.id } }, relations: ['category'] });
    if (!income) throw new NotFoundException('Income not found');

    if (input.categoryId) {
        income.category = (await this.categoryRepo.findOneBy({ id: input.categoryId })) || undefined;
    }

    Object.assign(income, input);
    return this.repo.save(income);
  }

  async findAll(user: User): Promise<Income[]> {
    return this.repo.find({ where: { user: { id: user.id } }, relations: ['category'] });
  }

  async findOne(user: User, id: string): Promise<Income> {
    const income = await this.repo.findOne({ where: { id, user: { id: user.id } }, relations: ['category'] });
    if (!income) throw new NotFoundException('Income not found');
    return income;
  }
}
