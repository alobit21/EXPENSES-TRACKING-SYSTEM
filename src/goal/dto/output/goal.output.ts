// dto/output/goal.output.ts
import { ObjectType, Field, ID, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';

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

  @Field(() => GraphQLDate,{ nullable: true })
  deadline?: Date;
}
