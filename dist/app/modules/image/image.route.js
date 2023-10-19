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
exports.ImageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const image_controller_1 = require("./image.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/add-image', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), multer_1.default, image_controller_1.ImageController.addImage);
router.patch('/:imageId', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), multer_1.default, image_controller_1.ImageController.editImage);
router.delete('/:imageId', (0, auth_1.default)(auth_1.ENUM_USER_ROLE.ADMIN, auth_1.ENUM_USER_ROLE.SUPER_ADMIN), image_controller_1.ImageController.deleteImage);
router.get('/:imageId', image_controller_1.ImageController.deleteImage);
router.get('/', image_controller_1.ImageController.getAllmages);
exports.ImageRoutes = router;
