/* eslint-disable no-undef */
import httpStatus from 'http-status';
import { cloudinaryHelper } from '../../../cloudinary/cloudinaryHelper';
import ApiError from '../../../errors/ApiError';
import { TCustomOrder } from './customOrder.interface';
import { CustomOrder } from './customOrder.model';
import { User } from '../user/user.model';

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

export const CustomOrderService = {
  createCustomOrder,
};
