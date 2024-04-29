const mongoose = require("mongoose");

const RoomTypeSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please add a name"],
        maxlength: [50, "Name can not be more than 50 characaters"],
    },
    personLimit: {
        // how many people can stay in this room
        type: Number,
        min: [1, "Capacity must be greater than 0"],
        required: [true, "Please add a capacity"],
    },
    price: {
        type: Number,
        required: [true, "Please add a price"],
    },
    roomLimit: {
        // how many rooms of this type are available
        type: Number,
        required: [true, "Please add a room capacity"],
    },
});

module.exports = mongoose.model("RoomType", RoomTypeSchema);
