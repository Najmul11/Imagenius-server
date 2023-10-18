/* eslint-disable no-console */
/* eslint-disable no-undef */
import httpStatus from 'http-status';
import { cloudinaryHelper } from '../../../cloudinary/cloudinaryHelper';
import ApiError from '../../../errors/ApiError';
import { IImage, IImageFilters } from './image.interface';
import { Image } from './image.model';
import { IPaginationOptions } from '../../../pagination/pagination.interface';
import { paginationHelpers } from '../../../pagination/paginationHelpers';
import { SortOrder } from 'mongoose';
import { imageSearchableFields } from './image.constant';

const addImage = async (
  imageInfo: IImage,
  image: Express.Multer.File | undefined
): Promise<IImage | null> => {
  const { title, price } = imageInfo;

  if (!title || !price)
    throw new ApiError(httpStatus.BAD_REQUEST, 'All fields are required');

  let imageUrl = null;
  if (image)
    imageUrl = await cloudinaryHelper.uploadToCloudinary(
      image,
      'Imagenius/images'
    );

  imageInfo.image = imageUrl!.photoUrl;
  imageInfo.publicId = imageUrl!.publicId;
  const result = await Image.create(imageInfo);

  return result;
};
const getAllmages = async (
  filters: IImageFilters,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: imageSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
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

  const total = await Image.countDocuments(whereConditions);

  const result = await Image.find(whereConditions)
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

const getSingleImage = async (imageId: string) => {
  const result = await Image.findById(imageId);
  return result;
};

const editImage = async (payload: Partial<IImage>, imageId: string) => {
  const image = await Image.findById(imageId);
  if (!image)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image does not exist');

  const result = await Image.findByIdAndUpdate(imageId, payload, {
    new: true,
  });
  return result;
};

const deleteImage = async (imageId: string) => {
  const image = await Image.findById(imageId);
  if (!image)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image does not exist');

  const result = await Image.findByIdAndDelete(imageId);
  await cloudinaryHelper.deleteFromCloudinary(image?.publicId);
  return result;
};

export const ImageService = {
  addImage,
  getAllmages,
  editImage,
  deleteImage,
  getSingleImage,
};
