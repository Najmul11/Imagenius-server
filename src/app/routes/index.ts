import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CategoryRoutes } from '../modules/categories/categories.route';
import { ImageRoutes } from '../modules/image/image.route';
import { OrderRoutes } from '../modules/orders/order.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/images',
    route: ImageRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const routes = router;
