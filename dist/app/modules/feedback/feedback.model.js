"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    feedback: {
        type: String,
        // required: true,
    },
    rating: {
        type: Number,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
});
exports.Feedback = (0, mongoose_1.model)('Feedback', feedbackSchema);
