import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { User } from '../user/user.entity';
import { CreateCategoryInput } from './dto/input/create-category.input';
import { UpdateCategoryInput } from './dto/input/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
  ) {}

  
async create(user: User, input: CreateCategoryInput): Promise<Category> {
  const category = this.repo.create({ ...input, user });
  return this.repo.save(category);
}


  async update(user: User, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.repo.findOne({
      where: { id: input.id, user: { id: user.id } },
    });

    if (!category) {
      throw new Error(`Category with id ${input.id} not found`);
    }

    this.repo.merge(category, input);
    return this.repo.save(category);
  }

  async findAll(user: User): Promise<Category[]> {
    return this.repo.find({
      where: { user: { id: user.id } },
      relations: ['expenses'], // preload related expenses
    });
  }

  async findOne(user: User, id: string): Promise<Category> {
    const category = await this.repo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['expenses'],
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    return category;
  }

  async remove(user: User, id: string): Promise<boolean> {
    const category = await this.repo.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    await this.repo.remove(category);
    return true;
  }
}
