import { GET_CATEGORIES } from '../api/category/queries';
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../api/category/mutations';
import type{
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesResponse
} from '../types/category';
import { useMutation, useQuery } from '@apollo/client/react';

export const useCategories = () => {
  const { data, loading, error, refetch } = useQuery<GetCategoriesResponse>(GET_CATEGORIES);
  
  const [createCategoryMutation] = useMutation<CreateCategoryResponse>(CREATE_CATEGORY, {
    update: (cache, { data }) => {
      // Read the existing categories from cache
      const existingCategories = cache.readQuery<GetCategoriesResponse>({
        query: GET_CATEGORIES,
      });

      // If we have data and existing categories, write back to cache
      if (data?.createCategory && existingCategories) {
        cache.writeQuery({
          query: GET_CATEGORIES,
          data: {
            getCategories: [...existingCategories.getCategories, data.createCategory],
          },
        });
      }
    },
  });

  const [updateCategoryMutation] = useMutation<UpdateCategoryResponse>(UPDATE_CATEGORY, {
    update: (cache, { data }) => {
      const existingCategories = cache.readQuery<GetCategoriesResponse>({
        query: GET_CATEGORIES,
      });

      if (data?.updateCategory && existingCategories) {
        cache.writeQuery({
          query: GET_CATEGORIES,
          data: {
            getCategories: existingCategories.getCategories.map(category =>
              category.id === data.updateCategory.id ? data.updateCategory : category
            ),
          },
        });
      }
    },
  });

  const [deleteCategoryMutation] = useMutation<DeleteCategoryResponse>(DELETE_CATEGORY, {
    update: (cache, { data }, { variables }) => {
      if (data?.removeCategory) {
        const existingCategories = cache.readQuery<GetCategoriesResponse>({
          query: GET_CATEGORIES,
        });

        if (existingCategories) {
          cache.writeQuery({
            query: GET_CATEGORIES,
            data: {
              getCategories: existingCategories.getCategories.filter(
                category => category.id !== variables?.id
              ),
            },
          });
        }
      }
    },
  });

  const createCategory = async (input: CreateCategoryInput): Promise<Category | undefined> => {
    try {
      const { data } = await createCategoryMutation({
        variables: { input },
        optimisticResponse: {
          createCategory: {
            __typename: 'Category',
            id: `temp-${Date.now()}`,
            name: input.name,
          },
        } as CreateCategoryResponse,
      });
      return data?.createCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (input: UpdateCategoryInput): Promise<Category | undefined> => {
    try {
      const { data } = await updateCategoryMutation({
        variables: { input },
        optimisticResponse: {
          updateCategory: {
            __typename: 'Category',
            id: input.id,
            name: input.name,
          },
        } as UpdateCategoryResponse,
      });
      return data?.updateCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean | undefined> => {
    try {
      const { data } = await deleteCategoryMutation({
        variables: { id },
        optimisticResponse: {
          removeCategory: true,
        } as DeleteCategoryResponse,
        update: (cache) => {
          // Remove the category from cache
          cache.evict({ id: `Category:${id}` });
          cache.gc(); // Clean up cache
        },
      });
      return data?.removeCategory;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    categories: data?.getCategories || [],
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};