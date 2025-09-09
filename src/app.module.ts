import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { CategoryModule } from './category/category.module';
import { GoalModule } from './goal/goal.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { FinanceModule } from './finance/finance.module';
import { GraphQLDate } from 'graphql-scalars';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule, // ✅ make TypeORM DataSource available globally

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,       // ✅ enable GraphQL Playground
      csrfPrevention: false, 
      resolvers: { Date: GraphQLDate }, // 👈 tell NestJS to use GraphQLDate

      context: ({ req }) => ({ req }), // ⚠️ This is required for Passport
    }),

    UserModule,
    ExpenseModule,
    IncomeModule,
    CategoryModule,
    GoalModule,
    AuthModule,
    FinanceModule, // ✅ add this
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
