/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IImage = {
  _id?: Types.ObjectId | undefined | null;
  image: string;
  publicId: string;
  title: string;
  price: number;
  category: string;
};

export type IImageFilters = {
  searchTerm?: string;
  category?: string;
};

export type Imagemodel = Model<IImage, Record<string, unknown>>;
