// dto/output/goal.output.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class GoalOutput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Float)
  targetAmount: number;

  @Field(() => Float)
  currentAmount: number;

  @Field({ nullable: true })
  deadline?: Date;
}
