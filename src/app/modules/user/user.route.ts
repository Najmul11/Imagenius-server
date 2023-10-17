import express from 'express';
import { UserController } from './user.controller';
import singleUpload from '../../middlewares/multer';
import validateRequest from '../../middlewares/validateRequest';
import { Uservalidation } from './user.validation';
import auth, { ENUM_USER_ROLE } from '../../middlewares/auth';

const router = express.Router();

router.post('/signup', singleUpload, UserController.createUser);

router.post(
  '/login',
  validateRequest(Uservalidation.userLoginZodSchema),
  UserController.loginUser
);

router.patch(
  '/make-admin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.makeAdmin
);
router.patch(
  '/remove-admin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.removeAdmin
);
router.delete(
  '/delete-user',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

router.get(
  '/get-profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getProfile
);

router.patch(
  '/update-profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.updateProfile
);

router.patch(
  '/change-payment',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.changePaymentMethod
);

router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.changePassword
);
router.get('/', UserController.getAllUsers);

router.post(
  '/refresh-token',
  validateRequest(Uservalidation.refreshTokenZodSchema),
  UserController.refreshToken
);

export const UserRoutes = router;
