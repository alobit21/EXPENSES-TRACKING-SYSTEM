// auth.output.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class AuthOutput {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;


}