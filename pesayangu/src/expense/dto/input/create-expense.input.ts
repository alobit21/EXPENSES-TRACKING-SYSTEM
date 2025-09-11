// dto/input/create-expense.input.ts
import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { PaymentMethod } from 'src/expense/expense.entity';

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

  @Field()
  paymentMethod?: PaymentMethod;
}
