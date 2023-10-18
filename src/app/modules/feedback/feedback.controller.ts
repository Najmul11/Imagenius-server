import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { FeedbackService } from './feedback.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createFeedback = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await FeedbackService.createFeedback(payload, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thanks for the  feedback',
    data: result,
  });
});

export const FeedbackController = {
  createFeedback,
};
