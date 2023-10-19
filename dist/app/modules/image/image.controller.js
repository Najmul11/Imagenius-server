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
exports.ImageController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../shared/catchAsyncError"));
const image_service_1 = require("./image.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const image_constant_1 = require("./image.constant");
const pagination_constant_1 = require("../../../pagination/pagination.constant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const addImage = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageInfo = req.body;
    const image = req.file;
    const result = yield image_service_1.ImageService.addImage(imageInfo, image);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Image added successfully',
        data: result,
    });
}));
const getAllmages = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, image_constant_1.imageFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_constant_1.paginationFields);
    const result = yield image_service_1.ImageService.getAllmages(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All images retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleImage = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    const result = yield image_service_1.ImageService.getSingleImage(imageId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Image retrieved successfully',
        data: result,
    });
}));
const editImage = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { imageId } = req.params;
    const result = yield image_service_1.ImageService.editImage(payload, imageId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Image data edited successfully',
        data: result,
    });
}));
const deleteImage = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    const result = yield image_service_1.ImageService.deleteImage(imageId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Image deleted successfully',
        data: result,
    });
}));
exports.ImageController = {
    getAllmages,
    addImage,
    deleteImage,
    editImage,
    getSingleImage,
};
