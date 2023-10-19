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
exports.ENUM_USER_ROLE = void 0;
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../jwt/jwtHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
var ENUM_USER_ROLE;
(function (ENUM_USER_ROLE) {
    ENUM_USER_ROLE["ADMIN"] = "admin";
    ENUM_USER_ROLE["USER"] = "user";
    ENUM_USER_ROLE["SUPER_ADMIN"] = "super admin";
})(ENUM_USER_ROLE || (exports.ENUM_USER_ROLE = ENUM_USER_ROLE = {}));
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, ' You are not authorized');
        }
        let verifiedUser = null;
        verifiedUser = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
