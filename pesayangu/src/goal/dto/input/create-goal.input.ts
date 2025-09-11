// dto/input/create-goal.input.ts
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateGoalInput {
  @Field()
  title: string;

  @Field(() => Float)
  targetAmount: number;

  @Field({ nullable: true })
  deadline?: Date;
}
