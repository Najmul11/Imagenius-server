import express from 'express';
import auth, { ENUM_USER_ROLE } from '../../middlewares/auth';
import { FeedbackController } from './feedback.controller';

const router = express.Router();

router.post('/', auth(ENUM_USER_ROLE.USER), FeedbackController.createFeedback);

export const FeedbackRoutes = router;
