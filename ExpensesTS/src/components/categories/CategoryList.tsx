import React from 'react';
import { Trash2, Edit, Plus, Tag } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../types/category';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { categories, loading, error, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse sm:text-xl">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg font-medium text-red-500 sm:text-xl">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl tracking-tight">
              Expense Categories
            </h1>
            <p className="mt-2 text-base text-gray-500 sm:text-lg">
              Organize your expenses with custom categories
            </p>
          </div>
     <button
    onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 w-full sm:w-auto justify-center"
  >
    <Plus size={18} className="md:size-5" />
    <span className=" sm:inline">Add Category</span>
  </button>
          
        </div>

        {/* Category Form Modals */}
        {showForm && (
          <CategoryForm
            category={null}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          />
        )}
        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSuccess={() => setEditingCategory(null)}
          />
        )}

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-blue-500 sm:size-20" />
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg truncate">
                    {category.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    aria-label="Edit category"
                  >
                    <Edit size={16} className="sm:size-18" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this category?')) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                    aria-label="Delete category"
                  >
                    <Trash2 size={16} className="sm:size-18" />
                  </button>
                </div>
              </div>
              {category.expenses && category.expenses.length > 0 ? (
                <div className="text-sm text-gray-600">
                  <p className="text-xs sm:text-sm">{category.expenses.length} expense(s)</p>
                  <p className="text-xs sm:text-sm text-red-600 font-medium">
                    Total: ${category.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500"></p>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
            <Tag size={36} className="mx-auto mb-3 text-gray-300 animate-pulse sm:size-48" />
            <p className="text-base font-medium text-gray-600 sm:text-lg">No categories found</p>
            <p className="text-sm text-gray-500 sm:text-base">Create your first category to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;