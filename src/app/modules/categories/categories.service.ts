import { Category } from './categories.model';

const getAllCategories = async () => {
  const result = await Category.find({ popular: true });
  return result;
};

export const CategoryService = {
  getAllCategories,
};
