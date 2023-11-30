import { Model, Types } from 'mongoose';

export type TCustomOrder = {
  user: Types.ObjectId | undefined;
  image: {
    photoUrl: string;
    publicId: string;
  };
  status: 'pending' | 'done';
  service: string;
};

export type CostomOrderModel = Model<TCustomOrder, Record<string, unknown>>;
