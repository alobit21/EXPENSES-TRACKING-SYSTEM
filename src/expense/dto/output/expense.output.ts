// dto/output/expense.output.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ExpenseOutput {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;

  @Field()
  date: Date;
}
