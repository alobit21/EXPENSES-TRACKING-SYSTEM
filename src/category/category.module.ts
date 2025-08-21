import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryResolver } from './reslover/category.resolver';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Module({

 imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryResolver,CategoryService], // <-- include both resolvers
  exports:[CategoryService]

})
export class CategoryModule {}
