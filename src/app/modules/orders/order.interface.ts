import { Model, Types } from 'mongoose';
import { IImage } from '../image/image.interface';
import { IUser } from '../user/user.interface';

export type IOrder = {
  _id?: Types.ObjectId;
  image: Types.ObjectId | IImage;
  customer: Types.ObjectId | IUser;
  status: 'pending' | 'completed' | 'cancelled';
};

export type IOrderFilters = {
  status?: string;
  customer?: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
