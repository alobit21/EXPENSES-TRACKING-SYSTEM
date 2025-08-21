import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Resolver()
export class UserInfoQuery {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  @Query(() => [User])
  users() {
    return this.userRepo.find();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id', { type: () => Int }) id: number) {
    return this.userRepo.findOne({ where: { id: id.toString() } }); // If your ID column is string
  }

  
}
