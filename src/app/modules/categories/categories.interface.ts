import { Model } from 'mongoose';

export type ICategory = {
  category: string;
  image: string;
};

export type ICategoryFilters = {
  categoey?: string;
  popular?: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
