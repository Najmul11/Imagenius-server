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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../../config"));
const catchAsyncError_1 = __importDefault(require("../../../shared/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const avatar = req.file;
    const result = yield user_service_1.UserService.createUser(user, avatar);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User created successfully',
        data: result,
    });
}));
const loginUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield user_service_1.UserService.loginUser(loginData);
    const { refreshToken } = result, others = __rest(result, ["refreshToken"]);
    const cookieOptions = {
        secure: config_1.default.env === ' production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user logged in successfully!',
        data: others,
    });
}));
const refreshToken = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_service_1.UserService.refreshToken(refreshToken);
    const cookieOptions = {
        secure: config_1.default.env === ' production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New access token generated successfully',
        data: result,
    });
}));
const getAllUsers = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All users retrieved successfully',
        data: result,
    });
}));
const makeAdmin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const result = yield user_service_1.UserService.makeAdmin(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User promoted as admin successfully',
        data: result,
    });
}));
const removeAdmin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const result = yield user_service_1.UserService.removeAdmin(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User demoted from admin successfully',
        data: result,
    });
}));
const getProfile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.UserService.getProfile(user === null || user === void 0 ? void 0 : user._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
const updateProfile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.user;
    const result = yield user_service_1.UserService.updateProfile(payload, user === null || user === void 0 ? void 0 : user._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
}));
const changePaymentMethod = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.user;
    const result = yield user_service_1.UserService.changePaymentMethod(payload, user === null || user === void 0 ? void 0 : user._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment method changed successfully',
        data: result,
    });
}));
const changePassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.user;
    const result = yield user_service_1.UserService.changePassword(payload, user === null || user === void 0 ? void 0 : user._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password  updated successfully',
        data: result,
    });
}));
const deleteUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const user = req.user;
    const result = yield user_service_1.UserService.deleteUser(userId, user === null || user === void 0 ? void 0 : user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
exports.UserController = {
    createUser,
    loginUser,
    refreshToken,
    getProfile,
    getAllUsers,
    makeAdmin,
    removeAdmin,
    deleteUser,
    changePaymentMethod,
    changePassword,
    updateProfile,
};
