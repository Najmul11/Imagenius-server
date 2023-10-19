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
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelper_1 = require("../../../jwt/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const cloudinaryHelper_1 = require("../../../cloudinary/cloudinaryHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (user, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = user;
    if (!email || !password || !name)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'All fields are required');
    const userExist = yield user_model_1.User.findOne({ email });
    if (userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist');
    let avatarUrl = null;
    if (avatar)
        avatarUrl = yield cloudinaryHelper_1.cloudinaryHelper.uploadToCloudinary(avatar, 'Imagenius/avatars');
    user.avatar = avatarUrl;
    const result = yield user_model_1.User.create(user);
    const sanitizedResult = yield user_model_1.User.findById(result._id)
        .select('-password')
        .lean();
    return sanitizedResult;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email: givenEmail, password } = payload;
    const user = new user_model_1.User();
    const isUserExist = yield user.isUserExist(givenEmail);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (isUserExist.password &&
        !(yield user.isPasswordMatched(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, ' Password is incorrect');
    }
    // create access token , refresh token
    const { _id, email, name, role } = isUserExist;
    const photoUrl = (_a = isUserExist.avatar) === null || _a === void 0 ? void 0 : _a.photoUrl;
    const accessToken = jwtHelper_1.jwtHelpers.createToken({ _id, email, name, photoUrl, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({ _id, email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid refresh token');
    }
    const { _id } = verifiedToken;
    const isUserExist = yield user_model_1.User.findById(_id, { _id: 1, email: 1 });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const newAccesstoken = jwtHelper_1.jwtHelpers.createToken({
        _id: isUserExist._id,
        email: isUserExist.email,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccesstoken,
    };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({}, { avatar: 0, password: 0 });
    return result;
});
const makeAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(userId);
    if (!userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User do not exist here');
    const options = {
        role: 'admin',
    };
    const result = yield user_model_1.User.findByIdAndUpdate(userId, options, { new: true });
    return result;
});
const removeAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(userId);
    if (!userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User do not exist');
    const options = {
        role: 'user',
    };
    const result = yield user_model_1.User.findByIdAndUpdate(userId, options, { new: true });
    return result;
});
const updateProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(userId);
    if (!userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User do not exist');
    const result = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
    return result;
});
const changePaymentMethod = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(userId);
    if (!userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User do not exist');
    const result = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
    return result;
});
const changePassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const user = yield user_model_1.User.findById(userId).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!(yield bcrypt_1.default.compare(oldPassword, user.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, ' Old password is incorrect');
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_round));
    const updatedData = {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
    };
    yield user_model_1.User.findByIdAndUpdate(userId, updatedData);
});
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(userId, {
        avatar: 1,
        email: 1,
        name: 1,
        payment: 1,
    });
    return result;
});
const deleteUser = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(userId);
    if (!userExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User do not exist');
    if (userExist.role === 'super admin')
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized');
    if (role === 'admin' && userExist.role == 'admin')
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized');
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    return result;
});
exports.UserService = {
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
