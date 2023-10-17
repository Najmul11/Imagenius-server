/* eslint-disable no-console */
/* eslint-disable no-undef */
import httpStatus from 'http-status';
import { cloudinaryHelper } from '../../../cloudinary/cloudinaryHelper';
import ApiError from '../../../errors/ApiError';
import { IImage } from './image.interface';
import { Image } from './image.model';

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
const getAllmages = async () => {
  const result = await Image.find({});
  return result;
};

export const ImageService = {
  addImage,
  getAllmages,
};
