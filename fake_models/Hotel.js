const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            unique: true,
            trim: true,
            maxlength: [50, "Name can not be more than 50 characaters"],
        },
        city: {
            type: String,
            required: [true, "Please add a city"],
            trim: true,
            maxlength: [50, "City can not be more than 50 characaters"],
        },
        address: {
            type: String,
            required: [true, "Please add an address"],
        },
        tel: {
            type: String,
            require: [true, "Please add a telephone number"],
        },
        capacity: {
            type: Number,
            min: [1, "Capacity must be greater than 0"],
            required: [true, "Please add a capacity"],
        },
        file: {
            type: String,
            required: [true, "Please add a picture of the hotel"],
        },
        price: {
            type: Number,
            default: 0,
        },
        bookCount: {
            type: Number,
            default: 0,
        },
        priority: {
            type: Number,
            default: 0,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Cascade delete Hotels when a hotel is deleted
// HotelSchema.pre(
//     "deleteOne",
//     { document: true, query: false },
//     async function (next) {
//         console.log(`Booking being removed from hotel ${this._id}`);
//         await this.model("Booking").deleteMany({ hotel: this._id });
//         await this.model("Review").deleteMany({ hotel: this._id });
//         await this.model("RoomType").deleteMany({ hotel: this._id });
//         next();
//     }
// );

// Reverse populate with virtuals
HotelSchema.virtual("booking", {
    ref: "Booking",
    localField: "_id",
    foreignField: "hotel",
    justOne: false,
});

HotelSchema.virtual("review", {
    ref: "Review",
    localField: "_id",
    foreignField: "hotel",
    justOne: false,
});

HotelSchema.virtual("roomType", {
    ref: "RoomType",
    localField: "_id",
    foreignField: "hotel",
    justOne: false,
});

module.exports = mongoose.model("Hotel", HotelSchema);
