// dto/output/expense.output.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { CategoryMutation } from 'src/category/dto/output/category.mutation';
import { CategoryOutput } from 'src/category/dto/output/category.output';
import { Column } from 'typeorm';

@ObjectType()
export class ExpenseOutput {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;

  @Field(()=> GraphQLDate)
  @Column({ type: 'date' })
  date: Date;

  @Field()
  paymentMethod?: string;

  @Field(()=> CategoryOutput, {nullable:true})
  category: CategoryOutput;
}
