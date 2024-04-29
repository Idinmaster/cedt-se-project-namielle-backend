const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
    let query;
    if (req.user.role !== "admin") {
        query = Booking.find({ user: req.user.id }).populate({
            path: "hotel",
            select: "name address tel file",
        });
    } else {
        if (req.params.hotelId) {
            // console.log(req.params.hotelId);
            query = Booking.find({ hotel: req.params.hotelId }).populate({
                path: "hotel",
                select: "name address tel file",
            });
        } else {
            query = Booking.find().populate({
                path: "hotel",
                select: "name address tel file",
            });
        }
    }
    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (err) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: "hotel",
            select: "name description tel file",
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

//@desc Add booking
//@route POST /api/v1/hotels/:hotelId/bookings/
//@access Private
exports.addBooking = async (req, res, next) => {
    try {
        console.log(req.user);
        req.body.hotel = req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`,
            });
        }

        req.body.user = req.user.id;
        const hotelCapacity = hotel.capacity;
        const hotelExistedBookings = await Booking.find({
            hotel: req.params.hotelId,
        });
        const existedBookings = await Booking.find({ user: req.user.id });
        if (hotelExistedBookings.length >= hotelCapacity) {
            return res.status(400).json({
                success: false,
                message: `The hotel with ID ${req.params.hotelId} has already reached its capacity`,
            });
        }
        if (existedBookings.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 bookings`,
            });
        }

        // await Booking.create(req.body);

        //Decreased roomLimit
        const roomType = await RoomType.findById(booking.roomType);
        let totalRoomLimit = roomType.roomLimit - 1;
        await RoomType.findByIdAndUpdate(booking.roomType, {
            roomLimit: totalRoomLimit,
        });

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot create Booking" });
    }
};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }

        // Make sure user is booking owner
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`,
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot update Booking" });
    }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }

        // Make sure user is booking owner
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`,
            });
        }
        //Increased roomLimit
        const roomType = await RoomType.findById(booking.roomType);
        let totalRoomLimit = roomType.roomLimit + 1;
        await RoomType.findByIdAndUpdate(booking.roomType, {
            roomLimit: totalRoomLimit,
        });

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot delete Booking" });
    }
};
