import express from 'express';
import { OrderController } from './order.controller';
import auth, { ENUM_USER_ROLE } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-order',
  auth(ENUM_USER_ROLE.USER),
  OrderController.createOrder
);
router.patch(
  '/cancel-order/:orderId',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  OrderController.cancelOrder
);
router.patch(
  '/deliver-order/:orderId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  OrderController.deliverOrder
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getAllOrders
);

export const OrderRoutes = router;
