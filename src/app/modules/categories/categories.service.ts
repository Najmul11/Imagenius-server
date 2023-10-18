import { SortOrder } from 'mongoose';
import { IPaginationOptions } from '../../../pagination/pagination.interface';
import { paginationHelpers } from '../../../pagination/paginationHelpers';
import { ICategoryFilters } from './categories.interface';
import { Category } from './categories.model';

const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const { popular, ...filtersData } = filters;

  const andConditions = [];

  if (popular) {
    andConditions.push({ popular: true });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await Category.countDocuments(whereConditions);

  const result = await Category.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const CategoryService = {
  getAllCategories,
};
