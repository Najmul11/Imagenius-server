"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});
exports.Image = (0, mongoose_1.model)('Image', imageSchema);
