import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Expense } from 'src/expense/expense.entity';
import { Income } from 'src/income/income.entity';

@ObjectType()
@Entity()
@Unique(['name', 'user'])//composite unique key
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;


  @OneToMany(() => Expense, expense => expense.category, {nullable: true})
  expenses: Expense[];

  @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
  user: User;

   @OneToMany(() => Income, income => income.category)
  incomes?: Income[];

}
function unique(arg0: string[]): (target: typeof Category) => void | typeof Category {
  throw new Error('Function not implemented.');
}

