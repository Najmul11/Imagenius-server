"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
        required: [true, 'Image is required for the order'],
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer is required for the order'],
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
