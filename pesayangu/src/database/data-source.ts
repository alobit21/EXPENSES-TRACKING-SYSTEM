import 'dotenv/config'; // loads .env automatically
import { Category } from 'src/category/category.entity';
import { Expense } from 'src/expense/expense.entity';
import { Goal } from 'src/goal/goal.entity';
import { Income } from 'src/income/income.entity';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
 
// import other entities as needed

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pesayangu',
  entities: [User, Expense, Income, Category, Goal],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // CLI does NOT auto-create tables, use migrations
  logging: true,      // optional: logs SQL queries
});
