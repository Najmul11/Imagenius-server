"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../shared/catchAsyncError"));
const order_service_1 = require("./order.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const order_constant_1 = require("../image/order.constant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createOrder = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersData = req.body;
    const user = req.user;
    const orderResults = [];
    for (const orderData of ordersData) {
        const result = yield order_service_1.OrderService.createOrder(orderData, user === null || user === void 0 ? void 0 : user._id);
        orderResults.push(result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order created successfully',
        data: orderResults,
    });
}));
const getAllOrders = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, order_constant_1.oederFilterableFields);
    const result = yield order_service_1.OrderService.getAllOrders(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All orders retrived succesfully',
        data: result,
    });
}));
const cancelOrder = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderService.cancelOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order cancelled succesfully',
        data: result,
    });
}));
const deliverOrder = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderService.deliverOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order delivered succesfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrder,
    getAllOrders,
    cancelOrder,
    deliverOrder,
};
