import express from 'express';
import { UserController } from './user.controller';
import singleUpload from '../../middlewares/multer';
import validateRequest from '../../middlewares/validateRequest';
import { Uservalidation } from './user.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/signup', singleUpload, UserController.createUser);

router.post(
  '/login',
  validateRequest(Uservalidation.userLoginZodSchema),
  UserController.loginUser
);
router.get('/get-profile', auth, UserController.getProfile);

router.post(
  '/refresh-token',
  validateRequest(Uservalidation.refreshTokenZodSchema),
  UserController.refreshToken
);

export const UserRoutes = router;
