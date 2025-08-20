// dto/input/create-expense.input.ts
import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class CreateExpenseInput {
  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;

  @Field()
  date: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string;
}
