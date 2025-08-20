import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Category } from 'src/category/category.entity';
import { CreateCategoryInput } from '../input/create-category.input';
import { CategoryService } from 'src/category/category.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Resolver(() => Category)
export class CategoryMutation {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Category)
  createCategory(
    @Args('input') input: CreateCategoryInput,
    @CurrentUser() user: User,  // ✅ add this
  ) {
    return this.categoryService.create(user, input);
  }

}
