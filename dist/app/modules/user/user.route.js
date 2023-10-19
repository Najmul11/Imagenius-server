"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/signup', multer_1.default, user_controller_1.UserController.createUser);
router.post('/login', (0, validateRequest_1.default)(user_validation_1.Uservalidation.userLoginZodSchema), user_controller_1.UserController.loginUser);
router.patch('/make-admin', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.makeAdmin);
router.patch('/remove-admin', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.removeAdmin);
router.delete('/delete-user', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.deleteUser);
router.get('/get-profile', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.USER, auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getProfile);
router.patch('/update-profile', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.USER, auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.updateProfile);
router.patch('/change-payment', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN, auth_1.ENUM_USER_ROLE.USER), user_controller_1.UserController.changePaymentMethod);
router.patch('/change-password', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN, auth_1.ENUM_USER_ROLE.USER), user_controller_1.UserController.changePassword);
router.get('/', user_controller_1.UserController.getAllUsers);
router.post('/refresh-token', (0, validateRequest_1.default)(user_validation_1.Uservalidation.refreshTokenZodSchema), user_controller_1.UserController.refreshToken);
exports.UserRoutes = router;
