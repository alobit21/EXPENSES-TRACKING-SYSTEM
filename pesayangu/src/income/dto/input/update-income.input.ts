import { InputType, Field, ID, Float, PartialType } from '@nestjs/graphql';
import { CreateIncomeInput } from './create-income.input';

@InputType()
export class UpdateIncomeInput extends PartialType(CreateIncomeInput) {
  @Field(() => ID)
  id: string;
}
