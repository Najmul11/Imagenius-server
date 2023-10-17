/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { IOrder } from './order.interface';
import { Image } from '../image/image.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const image = await Image.findById(order.image);
  const customer = await User.findById(order.customer);

  if (!image) throw new ApiError(httpStatus.BAD_REQUEST, 'Image do not exist');
  if (!customer)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer do not exist');

  if (customer.role === 'admin')
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Admin not authorized to purchase'
    );

  const result = await Order.create(order);
  return result;
};
const getAllOrders = async () => {
  const result = await Order.find({})
    .populate('customer', 'email')
    .populate('image', 'image');
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
