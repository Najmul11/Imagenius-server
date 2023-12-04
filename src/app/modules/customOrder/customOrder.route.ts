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
router.patch(
  '/process-order',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CustomOrderController.processImage
);

router.get(
  '/all-custom-orders',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  CustomOrderController.getAllCustomOrders
);

export const CustomOrderRoutes = router;
