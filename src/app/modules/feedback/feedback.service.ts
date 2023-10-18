import { Types } from 'mongoose';
import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';

const createFeedback = async (payload: IFeedback, userId: string) => {
  payload.user = new Types.ObjectId(userId);
  const result = await Feedback.create(payload);
  return result;
};

export const FeedbackService = {
  createFeedback,
};
