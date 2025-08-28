 

// src/finance/finance.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Goal } from '../goal/goal.entity';
import { User } from '../user/user.entity';
import { FinanceOverviewOutput, ExpensesByCategory } from './dto/output/finance-overview.output';
import { startOfMonth, endOfMonth, subMonths, differenceInDays, format } from 'date-fns';
import { FinanceAnalyticsOutput, GoalAlert, MonthlyAmount, MonthlyCategoryExpense, MonthlyIncomeExpense } from './dto/output/finance-analytics.output';
import { DashboardAlerts, DashboardOutput } from './dto/output/dashboard.output';
import { CategoryExpense, MonthlyExpense } from './dto/output/finance-category-analytics.output';


@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Income) private incomeRepo: Repository<Income>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @InjectRepository(Goal) private goalRepo: Repository<Goal>,
  ) {}

  async getFinanceOverview(user: User): Promise<FinanceOverviewOutput> {
    const incomes = await this.incomeRepo.find({ where: { user: { id: user.id } } });
    const expenses = await this.expenseRepo.find({ where: { user: { id: user.id } }, relations: ['category'] });
    const goals = await this.goalRepo.find({ where: { user: { id: user.id } } });

    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const availableBalance = totalIncome - totalExpenses;

    const expensesByCategory = expenses.reduce((acc, exp) => {
      const name = exp.category?.name || 'Uncategorized';
      const found = acc.find(c => c.categoryName === name);
      if (found) {
        found.totalAmount += Number(exp.amount);
      } else {
        acc.push({ categoryName: name, totalAmount: Number(exp.amount) });
      }
      return acc;
    }, [] as ExpensesByCategory[]);

    let alert: string | undefined;
    if (totalExpenses / totalIncome >= 0.9) {
      alert = `⚠️ Expenses are ${Math.round((totalExpenses / totalIncome) * 100)}% of your total income!`;
    }

    return {
      totalIncome,
      totalExpenses,
      availableBalance,
      expensesByCategory,
      goals,
      recentIncomes: incomes.slice(-5).reverse(),
      recentExpenses: expenses.slice(-5).reverse(),
      alert,
    };
  }



    async getFinanceAnalytics(user: User): Promise<FinanceAnalyticsOutput> {
    const now = new Date();
    const months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      months.push(format(date, 'yyyy-MM'));
    }

    const monthlyIncome: MonthlyAmount[] = [];
    const monthlyExpenses: MonthlyAmount[] = [];

    for (const month of months) {
      const [year, m] = month.split('-').map(Number);

      const incomeSum = await this.incomeRepo
        .createQueryBuilder('income')
        .select('SUM(income.amount)', 'sum')
        .where('income.userId = :userId', { userId: user.id })
        .andWhere('EXTRACT(YEAR FROM income.date) = :year AND EXTRACT(MONTH FROM income.date) = :month', { year, month: m })
        .getRawOne();

      const expenseSum = await this.expenseRepo
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'sum')
        .where('expense.userId = :userId', { userId: user.id })
        .andWhere('EXTRACT(YEAR FROM expense.date) = :year AND EXTRACT(MONTH FROM expense.date) = :month', { year, month: m })
        .getRawOne();

      monthlyIncome.push({ month, total: Number(incomeSum.sum) || 0 });
      monthlyExpenses.push({ month, total: Number(expenseSum.sum) || 0 });
    }

    // Goal alerts
    const goals = await this.goalRepo.find({ where: { user: { id: user.id } } });
    const goalAlerts: GoalAlert[] = goals
      .filter(goal => goal.deadline)
      .map(goal => {
        const remainingAmount = Number(goal.targetAmount) - Number(goal.currentAmount);
        const daysLeft = differenceInDays(new Date(goal.deadline!), now);
        return { goalTitle: goal.title, remainingAmount, deadline: goal.deadline!, daysLeft };
      })
      .filter(alert => alert.daysLeft <= 30); // only show if within 30 days

    // High expense alert
    const totalIncome = monthlyIncome.reduce((sum, i) => sum + i.total, 0);
    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.total, 0);
    const highExpenseAlert =
      totalIncome && totalExpenses / totalIncome >= 0.9
        ? `⚠️ Expenses are ${(totalExpenses / totalIncome * 100).toFixed(0)}% of your total income!`
        : undefined;

    return { monthlyIncome, monthlyExpenses, goalAlerts, highExpenseAlert };
  }


  async getDashboard(user: User): Promise<DashboardOutput> {
    // Total income and expenses
    const incomeTotalRaw = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.userId = :userId', { userId: user.id })
      .getRawOne();

    const expenseTotalRaw = await this.expenseRepo
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId: user.id })
      .getRawOne();

    const totalIncome = Number(incomeTotalRaw.total) || 0;
    const totalExpense = Number(expenseTotalRaw.total) || 0;

    // Category analytics
    const categoryData = await this.expenseRepo
      .createQueryBuilder('expense')
      .select('category.name', 'categoryName')
      .addSelect('SUM(expense.amount)', 'totalSpent')
      .addSelect('COUNT(expense.id)', 'transactionCount')
      .leftJoin('expense.category', 'category')
      .where('expense.userId = :userId', { userId: user.id })
      .groupBy('category.name')
      .orderBy('totalSpent', 'DESC')
      .getRawMany();

    const topCategories: CategoryExpense[] = categoryData.map(c => ({
      categoryName: c.categoryName || 'Uncategorized',
      totalSpent: Number(c.totalSpent),
      transactionCount: Number(c.transactionCount),
    }));

    // Monthly expenses for past 12 months
    const now = new Date();
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      months.push(format(date, 'yyyy-MM'));
    }

    const monthlyExpenses: MonthlyExpense[] = [];
    for (const month of months) {
      const [year, m] = month.split('-').map(Number);
      const raw = await this.expenseRepo
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'total')
        .where('expense.userId = :userId', { userId: user.id })
        .andWhere('EXTRACT(YEAR FROM expense.date) = :year AND EXTRACT(MONTH FROM expense.date) = :month', { year, month: m })
        .getRawOne();

      monthlyExpenses.push({ month, totalSpent: Number(raw.total) || 0 });
    }

    // Goals and deadline alerts
    const goals = await this.goalRepo.find({ where: { user: { id: user.id } } });
    let goalDeadlineWarning: string | undefined;
    const today = new Date();
    for (const goal of goals) {
      if (goal.deadline && (goal.deadline.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 7) {
        goalDeadlineWarning = `Goal "${goal.title}" is nearing its deadline`;
        break;
      }
    }

    // High expense alert
    const highExpenseWarning =
      totalExpense / totalIncome >= 0.8
        ? 'Warning: Expenses are above 80% of total income'
        : undefined;

    const alerts: DashboardAlerts = { goalDeadlineWarning, highExpenseWarning };

    return {
      totalIncome,
      totalExpense,
      topCategories,
      monthlyExpenses,
      goals,
      alerts,
    };
  }

   


  async getMonthlyCategoryExpenses(user: User, monthsBack = 12): Promise<MonthlyCategoryExpense[]> {
  const now = new Date();
  const results: MonthlyCategoryExpense[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthStr = format(date, 'yyyy-MM');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const raw = await this.expenseRepo
      .createQueryBuilder('expense')
      .select('category.name', 'categoryName')
      .addSelect('SUM(expense.amount)', 'totalSpent')
      .leftJoin('expense.category', 'category')
      .where('expense.userId = :userId', { userId: user.id })
      .andWhere('EXTRACT(YEAR FROM expense.date) = :year AND EXTRACT(MONTH FROM expense.date) = :month', { year, month })
      .groupBy('category.name')
      .getRawMany();

    raw.forEach(r => {
      results.push({
        month: monthStr,
        categoryName: r.categoryName || 'Uncategorized',
        totalSpent: Number(r.totalSpent),
      });
    });
  }

  return results;
}
// Returns monthly income vs expense for past N months
async getMonthlyIncomeExpense(user: User, monthsBack = 12): Promise<MonthlyIncomeExpense[]> {
  const now = new Date();
  const results: MonthlyIncomeExpense[] = [];
 
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthStr = format(date, 'yyyy-MM');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const incomeRaw = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.userId = :userId', { userId: user.id })
      .andWhere('EXTRACT(YEAR FROM income.date) = :year AND EXTRACT(MONTH FROM income.date) = :month', { year, month })
      .getRawOne();

    const expenseRaw = await this.expenseRepo
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId: user.id })
      .andWhere('EXTRACT(YEAR FROM expense.date) = :year AND EXTRACT(MONTH FROM expense.date) = :month', { year, month })
      .getRawOne();

    const totalIncome = Number(incomeRaw.total) || 0;
    const totalExpense = Number(expenseRaw.total) || 0;

    results.push({
      month: monthStr,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    });
  }

  return results;
}

}

 

 

 

 
 


 
 
 