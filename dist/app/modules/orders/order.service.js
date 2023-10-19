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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const image_model_1 = require("../image/image.model");
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const order_model_1 = require("./order.model");
const mongoose_1 = require("mongoose");
const createOrder = (order, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield image_model_1.Image.findById(order._id);
    const customer = yield user_model_1.User.findById(userId);
    if (!image)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image do not exist');
    if (!customer)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Customer do not exist');
    if (customer.role === 'admin')
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin not authorized to purchase');
    const payload = {
        image: new mongoose_1.Types.ObjectId(order._id),
        customer: new mongoose_1.Types.ObjectId(userId),
    };
    const result = yield order_model_1.Order.create(payload);
    return result;
});
const getAllOrders = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andConditions = [];
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield order_model_1.Order.find(whereConditions)
        .populate('customer', 'email')
        .populate('image', 'image');
    return result;
});
const cancelOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderExist = yield order_model_1.Order.findById(orderId);
    if (!orderExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order do not exist');
    const data = {
        status: 'cancelled',
    };
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, data, { new: true });
    return result;
});
const deliverOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderExist = yield order_model_1.Order.findById(orderId);
    if (!orderExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order do not exist');
    const data = {
        status: 'completed',
    };
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, data, { new: true });
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    cancelOrder,
    deliverOrder,
};
