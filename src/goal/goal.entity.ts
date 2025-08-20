// goal.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Goal {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field(() => Float)
  @Column('decimal')
  targetAmount: number;

  @Field(() => Float, { defaultValue: 0 })
  @Column('decimal', { default: 0 })
  currentAmount: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  deadline?: Date;

  @ManyToOne(() => User, user => user.goals)
  user: User;
}
