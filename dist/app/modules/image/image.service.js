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
exports.ImageService = void 0;
/* eslint-disable no-console */
/* eslint-disable no-undef */
const http_status_1 = __importDefault(require("http-status"));
const cloudinaryHelper_1 = require("../../../cloudinary/cloudinaryHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const image_model_1 = require("./image.model");
const paginationHelpers_1 = require("../../../pagination/paginationHelpers");
const image_constant_1 = require("./image.constant");
const addImage = (imageInfo, image) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price } = imageInfo;
    if (!title || !price)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'All fields are required');
    let imageUrl = null;
    if (image)
        imageUrl = yield cloudinaryHelper_1.cloudinaryHelper.uploadToCloudinary(image, 'Imagenius/images');
    imageInfo.image = imageUrl.photoUrl;
    imageInfo.publicId = imageUrl.publicId;
    const result = yield image_model_1.Image.create(imageInfo);
    return result;
});
const getAllmages = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: image_constant_1.imageSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const total = yield image_model_1.Image.countDocuments(whereConditions);
    const result = yield image_model_1.Image.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleImage = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield image_model_1.Image.findById(imageId);
    return result;
});
const editImage = (payload, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield image_model_1.Image.findById(imageId);
    if (!image)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image does not exist');
    const result = yield image_model_1.Image.findByIdAndUpdate(imageId, payload, {
        new: true,
    });
    return result;
});
const deleteImage = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield image_model_1.Image.findById(imageId);
    if (!image)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image does not exist');
    const result = yield image_model_1.Image.findByIdAndDelete(imageId);
    yield cloudinaryHelper_1.cloudinaryHelper.deleteFromCloudinary(image === null || image === void 0 ? void 0 : image.publicId);
    return result;
});
exports.ImageService = {
    addImage,
    getAllmages,
    editImage,
    deleteImage,
    getSingleImage,
};
