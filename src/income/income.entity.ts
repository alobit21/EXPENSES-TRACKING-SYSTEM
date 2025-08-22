import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { GraphQLDate } from 'graphql-scalars';
@ObjectType()
@Entity()
export class Income {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('decimal')
  amount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => GraphQLDate)
  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, user => user.incomes)
  user: User;

  @ManyToOne(() => Category, category => category.incomes, { nullable: true })
  category?: Category;
}
