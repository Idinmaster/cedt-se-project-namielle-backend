const mongoose = require("mongoose");
const RoomType = require("./RoomType");

const BookingSchema = new mongoose.Schema({
    checkInDate: {
        type: String,
        required: true,
    },
    checkOutDate: {
        type: String,
        required: true,
    },
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
    roomType: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);
