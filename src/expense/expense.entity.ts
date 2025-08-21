// expense.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@ObjectType()
@Entity()
export class Expense {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('decimal')
  amount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, user => user.expenses)
  user: User;

@Field(() => Category, { nullable: true })  // ✅ GraphQL knows it can be null
@ManyToOne(() => Category, category => category.expenses, { nullable: true })
category: Category | null;  // ✅ allow null at the TS level


}
