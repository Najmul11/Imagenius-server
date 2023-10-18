/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IFeedback = {
  _id?: Types.ObjectId | undefined | null;
  feedback: string;
  rating: number;
  user: Types.ObjectId;
};

export type Feedbackmodel = Model<IFeedback, Record<string, unknown>>;
