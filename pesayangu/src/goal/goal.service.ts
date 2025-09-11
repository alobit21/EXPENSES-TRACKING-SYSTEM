// goal.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalInput } from './dto/input/create-goal.input';
import { UpdateGoalInput } from './dto/input/update-goal.input';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly repo: Repository<Goal>,

    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
  ) {}

  async create(user: User, input: CreateGoalInput): Promise<Goal> {
    const goal = this.repo.create({ ...input, user, currentAmount: 0 });
    return this.repo.save(goal);
  }

  async update(user: User, input: UpdateGoalInput): Promise<Goal> {
    const goal = await this.repo.findOne({ where: { id: input.id, user: { id: user.id } } });
    if (!goal) throw new NotFoundException(`Goal with id ${input.id} not found`);

    Object.assign(goal, input);
    return this.repo.save(goal);
  }

  async remove(user: User, id: string): Promise<boolean> {
    const goal = await this.repo.findOne({ where: { id, user: { id: user.id } } });
    if (!goal) throw new NotFoundException(`Goal with id ${id} not found`);
    await this.repo.remove(goal);
    return true;
  }

  async findAll(user: User): Promise<Goal[]> {
    return this.repo.find({ where: { user: { id: user.id } } });
  }

  async findOne(user: User, id: string): Promise<Goal> {
    const goal = await this.repo.findOne({ where: { id, user: { id: user.id } } });
    if (!goal) throw new NotFoundException(`Goal with id ${id} not found`);
    return goal;
  }

  // ✅ New method: contribute to a goal
  async contributeToGoal(user: User, goalId: string, amount: number): Promise<Goal> {
    const goal = await this.repo.findOne({ where: { id: goalId, user: { id: user.id } } });
    if (!goal) throw new NotFoundException(`Goal with id ${goalId} not found`);

    if (amount <= 0) throw new BadRequestException(`Contribution amount must be positive`);

    // Check total income and expenses
    const incomes = await this.incomeRepo.find({ where: { user: { id: user.id } } });
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

    const expenses = await this.expenseRepo.find({ where: { user: { id: user.id } } });
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    if (totalExpense + amount > totalIncome) {
      throw new BadRequestException(`Cannot contribute ${amount}. Expenses exceed total income!`);
    }

    goal.currentAmount += amount;

    // Deadline alert
    if (goal.deadline) {
      const today = new Date();
      const deadline = new Date(goal.deadline);
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        console.warn(`⚠️ Goal "${goal.title}" deadline is approaching in ${diffDays} day(s)!`);
      }
    }

    return this.repo.save(goal);
  }
}
