// resolver/auth.mutation.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RegisterInput } from '../dto/input/register.input';
import { AuthOutput } from '../dto/output/auth.output';
import { User } from '../../user/user.entity';
import { AuthService } from '../auth.services';
import { LoginInput } from '../dto/input/login.input';

@Resolver()
export class AuthMutation {
  constructor(private readonly authService: AuthService) {}

 

  @Mutation(() => AuthOutput)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

   @Mutation(() => User)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }
}
