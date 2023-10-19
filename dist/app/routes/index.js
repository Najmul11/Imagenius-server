"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const categories_route_1 = require("../modules/categories/categories.route");
const image_route_1 = require("../modules/image/image.route");
const order_route_1 = require("../modules/orders/order.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/categories',
        route: categories_route_1.CategoryRoutes,
    },
    {
        path: '/images',
        route: image_route_1.ImageRoutes,
    },
    {
        path: '/orders',
        route: order_route_1.OrderRoutes,
    },
    {
        path: '/feedback',
        route: feedback_route_1.FeedbackRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.routes = router;
