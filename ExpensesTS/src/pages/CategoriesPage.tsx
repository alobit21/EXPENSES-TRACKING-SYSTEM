import React from 'react';
import CategoryList from '../components/categories/CategoryList';
import { ToastContainer } from 'react-toastify';

const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position='top-right' autoClose={6000}/>
      <CategoryList />
    </div>
  );
};

export default CategoriesPage;