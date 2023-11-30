import express from 'express';
import { CustomOrderController } from './customOrder.controller';
import auth, { ENUM_USER_ROLE } from '../../middlewares/auth';
import singleUpload from '../../middlewares/multer';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER),
  singleUpload,
  CustomOrderController.createCustomOrder
);

export const CustomOrderRoutes = router;
