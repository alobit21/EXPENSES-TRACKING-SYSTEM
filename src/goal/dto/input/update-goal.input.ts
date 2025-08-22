// dto/input/update-goal.input.ts
import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class UpdateGoalInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  targetAmount?: number;

  @Field(() => Float, { nullable: true })
  currentAmount?: number;

  @Field({ nullable: true })
  deadline?: Date;
}
