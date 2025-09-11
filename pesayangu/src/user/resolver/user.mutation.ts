import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { CreateUserInput } from '../dto/input/create-user.input';

@Resolver(() => User)
export class UserMutation {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
  ): Promise<User> {
    // Use the update method from your service
    return this.userService.update(id, { name, email });
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}

