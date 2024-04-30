const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
    },
    info: {
        type: String,
        required: [true, "Please add an info"],
    },
    code: {
        type: String,
        unique: true,
        required: [true, "Please add a code"],
    },
    percentage: {
        type: Number,
        required: [true, "Please add a discount-percentage"],
    },
    image: {
        type: String,
        required: [true, "Please add a image"],
    },
});

module.exports = mongoose.model("Discount", DiscountSchema);
