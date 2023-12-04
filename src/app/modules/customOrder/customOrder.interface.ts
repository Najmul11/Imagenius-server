import { Model, Types } from 'mongoose';

export type TCustomOrder = {
  _id?: Types.ObjectId;
  user: Types.ObjectId | undefined;
  image: {
    photoUrl: string;
    publicId: string;
  };
  status: 'pending' | 'done';
  service: string;
};

export type ICustomOrderFilters = {
  status?: string;
  user?: string;
};

export type CostomOrderModel = Model<TCustomOrder, Record<string, unknown>>;
