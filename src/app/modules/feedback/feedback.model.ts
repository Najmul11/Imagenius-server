import { model, Schema } from 'mongoose';
import { IFeedback } from './feedback.interface';

const feedbackSchema = new Schema<IFeedback, Record<string, unknown>>({
  feedback: {
    type: String,
    // required: true,
  },
  rating: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
