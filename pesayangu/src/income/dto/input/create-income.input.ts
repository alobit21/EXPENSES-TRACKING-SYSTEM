import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateIncomeInput {
  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  categoryId?: string;
}
