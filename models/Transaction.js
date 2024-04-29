const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
    },
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
    stripe_id: {
        type: String,
    },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
