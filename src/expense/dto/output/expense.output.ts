// dto/output/expense.output.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { CategoryMutation } from 'src/category/dto/output/category.mutation';
import { CategoryOutput } from 'src/category/dto/output/category.output';

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

  @Field(()=> CategoryOutput, {nullable:true})
  category: CategoryOutput;
}
