import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Category } from '../category.entity';
import { User } from 'src/user/user.entity';
import { CreateCategoryInput } from '../dto/input/create-category.input';
import { UpdateCategoryInput } from '../dto/input/update-category.input';
import { CategoryService } from '../category.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
 

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // --- Queries ---
@Query(() => [Category])
@UseGuards(GqlAuthGuard)
getCategories(@CurrentUser() user: User) {
  console.log('Authenticated User:', user);
  return this.categoryService.findAll(user);
}



  @Query(() => Category, { name: 'category' })
  async getCategory(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Category> {
    return this.categoryService.findOne(user, id);
  }

  // --- Mutations ---
@Mutation(() => Category)
@UseGuards(GqlAuthGuard)
async createCategory(
  @CurrentUser() user: User,
  @Args('input') input: CreateCategoryInput,
): Promise<Category> {
  console.log('Current user:', user);
  return this.categoryService.create(user, input);
}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  async updateCategory(
    @CurrentUser() user: User,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeCategory(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.categoryService.remove(user, id);
  }
}

