import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const OrderSchema = new Schema<IOrder, OrderModel>(
  {
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required: [true, 'Image is required for the order'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required for the order'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder, OrderModel>('Order', OrderSchema);
