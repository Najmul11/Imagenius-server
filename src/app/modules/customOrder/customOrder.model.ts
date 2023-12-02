import { Schema, model } from 'mongoose';
import { CostomOrderModel, TCustomOrder } from './customOrder.interface';

const CustomOrderSchema = new Schema<TCustomOrder, Record<string, unknown>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
    image: {
      type: {
        photoUrl: String,
        publicId: String,
      },
    },
    service: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CustomOrder = model<TCustomOrder, CostomOrderModel>(
  'CustomOrder',
  CustomOrderSchema
);
