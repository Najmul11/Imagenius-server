import { Schema, model } from 'mongoose';
import { IImage, Imagemodel } from './image.interface';

const imageSchema = new Schema<IImage, Record<string, unknown>>({
  image: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Image = model<IImage, Imagemodel>('Image', imageSchema);
