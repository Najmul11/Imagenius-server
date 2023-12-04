/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import httpStatus from 'http-status';
import { cloudinaryHelper } from '../../../cloudinary/cloudinaryHelper';
import ApiError from '../../../errors/ApiError';
import { ICustomOrderFilters, TCustomOrder } from './customOrder.interface';
import { CustomOrder } from './customOrder.model';
import { User } from '../user/user.model';
import axios from 'axios';
import sharp from 'sharp';
import config from '../../../config';
import FormData from 'form-data';

const createCustomOrder = async (
  picture: Express.Multer.File | undefined,
  userId: string,
  payload: Partial<TCustomOrder>
) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

  if (!picture)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please Provide Image');

  let image = null;
  if (picture) {
    image = await cloudinaryHelper.uploadToCloudinary(
      picture,
      'Imagenius/custom-orders'
    );
  }

  payload.user = user._id!;
  payload.image = image!;

  await CustomOrder.create(payload);
};

const getAllCustomOrders = async (filters: ICustomOrderFilters) => {
  const { ...filtersData } = filters;
  const andConditions = [];

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await CustomOrder.find(whereConditions).populate({
    path: 'user',
    model: 'User',
    select: '-password',
  });

  return result;
};

const processImage = async (payload: TCustomOrder) => {
  const { _id, image, service, user } = payload;

  const response = await axios.get(image?.photoUrl, {
    responseType: 'arraybuffer',
  });
  const imageBuffer = Buffer.from(response.data, 'binary');

  let processedImageBuffer = null;

  switch (service) {
    case 'Blur':
      processedImageBuffer = await sharp(imageBuffer).blur(5).toBuffer();
      break;
    case 'Remove Background':
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_url', image?.photoUrl);

      try {
        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'X-Api-Key': config.remove_bg,
            },
            responseType: 'arraybuffer',
            // encoding: null,
          }
        );
        processedImageBuffer = Buffer.from(response.data, 'binary');
      } catch (error) {
        // Handle errors
      }
      break;
    case 'Circle Crop':
      // Handle Circle Crop
      break;
    default:
      // No specific service provided, perform a default operation
      break;
  }

  let newImage = null;
  if (processedImageBuffer) {
    await cloudinaryHelper.deleteFromCloudinary(image?.publicId);

    // Convert the processed image buffer to a new Multer File object
    const processedFile = {
      fieldname: 'file',
      originalname: 'processed_image.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: processedImageBuffer,
      size: processedImageBuffer.length,
    };

    // Upload the processed image to Cloudinary
    const processedImage = await cloudinaryHelper.uploadToCloudinary(
      processedFile as Express.Multer.File,
      'Imagenius/custom-orders'
    );
    newImage = processedImage;
  }

  const result = await CustomOrder.findByIdAndUpdate(
    _id,
    {
      status: 'done',
      service: service,
      image: newImage,
      user: user?._id,
    },
    { new: true }
  );

  return result;
};

export const CustomOrderService = {
  createCustomOrder,
  getAllCustomOrders,
  processImage,
};
