const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true,
    },
    stars: {
        type: Number,
        min: [1, "Lowest possible rating is 1"],
        max: [5, "Highest possible rating is 5"],
        required: [true, "please give a rating"],
    },
    description: {
        type: String,
        default: "No description given.",
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    isHidden: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Review", ReviewSchema);
