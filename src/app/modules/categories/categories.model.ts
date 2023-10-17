import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './categories.interface';

const CategorySchema = new Schema<ICategory, Record<string, unknown>>({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export const Category = model<ICategory, CategoryModel>(
  'Category',
  CategorySchema
);
