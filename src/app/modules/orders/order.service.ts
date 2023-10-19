/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { IOrder, IOrderFilters } from './order.interface';
import { Image } from '../image/image.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { Order } from './order.model';
import { Types } from 'mongoose';

const createOrder = async (
  order: IOrder,
  userId: string
): Promise<IOrder | null> => {
  const image = await Image.findById(order._id);
  const customer = await User.findById(userId);

  if (!image) throw new ApiError(httpStatus.BAD_REQUEST, 'Image do not exist');
  if (!customer)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer do not exist');

  if (customer.role === 'admin')
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Admin not authorized to purchase'
    );

  const payload = {
    image: new Types.ObjectId(order._id),
    customer: new Types.ObjectId(userId),
  };

  const result = await Order.create(payload);
  return result;
};

const getAllOrders = async (filters: IOrderFilters) => {
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

  const result = await Order.find(whereConditions)
    .populate('customer', 'email')
    .populate('image', 'image');
  return result;
};

const cancelOrder = async (orderId: string) => {
  const orderExist = await Order.findById(orderId);

  if (!orderExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order do not exist');

  const data = {
    status: 'cancelled',
  };

  const result = await Order.findByIdAndUpdate(orderId, data, { new: true });
  return result;
};
const deliverOrder = async (orderId: string) => {
  const orderExist = await Order.findById(orderId);

  if (!orderExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order do not exist');

  const data = {
    status: 'completed',
  };

  const result = await Order.findByIdAndUpdate(orderId, data, { new: true });
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  cancelOrder,
  deliverOrder,
};
