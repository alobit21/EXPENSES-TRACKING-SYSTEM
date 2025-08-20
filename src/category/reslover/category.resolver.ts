import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Category } from '../category.entity';
import { User } from 'src/user/user.entity';
import { CreateCategoryInput } from '../dto/input/create-category.input';
import { UpdateCategoryInput } from '../dto/input/update-category.input';
import { CategoryService } from '../category.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
 

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // --- Queries ---
  @Query(() => [Category], { name: 'categories' })
  async getCategories(@CurrentUser() user: User): Promise<Category[]> {
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
  async createCategory(
    @CurrentUser() user: User,
    @Args('input') input: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(user, input);
  }

  @Mutation(() => Category)
  async updateCategory(
    @CurrentUser() user: User,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(user, input);
  }

  @Mutation(() => Boolean)
  async removeCategory(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.categoryService.remove(user, id);
  }
}
