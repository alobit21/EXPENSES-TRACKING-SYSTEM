import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/input/create-user.input';
import { InjectRepository } from '@nestjs/typeorm'; // Add this import

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  
  create(input: CreateUserInput): Promise<User> {
    const user = this.userRepo.create(input);
    return this.userRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

    async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

 async findOne(id: string): Promise<User> {
  const user = await this.userRepo.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;

}


async update(id: string, attrs: Partial<User>) {
  const user = await this.userRepo.findOne({ where: { id } });
  if (!user) throw new Error('User not found');
  Object.assign(user, attrs);
  return this.userRepo.save(user);
}

async delete(id: string) {
  const result = await this.userRepo.delete(id);
  return (result.affected ?? 0) > 0;
}
}

