// expense.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { GraphQLDate } from 'graphql-scalars';


export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}
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

  @Field(() =>GraphQLDate)
  @Column({ type: 'date' })
  date: Date;

  @Field()
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH }
)
    
  paymentMethod?: PaymentMethod;

  @ManyToOne(() => User, user => user.expenses)
  user: User;

  @Field(() => Category, { nullable: true })    
  @ManyToOne(() => Category, category => category.expenses, {
    nullable: true,
    eager: true,   // 👈 this makes TypeORM auto-join category
  })
  category?: Category;



}

