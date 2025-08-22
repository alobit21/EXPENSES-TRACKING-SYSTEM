import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { IncomeMutations } from './resolver/income.mutations';
import { IncomeQueries } from './resolver/income.queries';
import { IncomeService } from './income.service';
import { Category } from 'src/category/category.entity';

@Module({

    imports:[TypeOrmModule.forFeature([Income,Category])],
    providers:[IncomeMutations,IncomeQueries,IncomeService],
    exports:[IncomeService]
})
export class IncomeModule {}
