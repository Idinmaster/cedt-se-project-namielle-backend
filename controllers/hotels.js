const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const RoomType = require("../models/RoomType");
const fs = require("fs");



//@desc Get all hotels
//@route GET /api/v1/hotels
//@access Public
exports.getHotels = async (req, res, next) => {
    let query;
    //Copy req.query
    const reqQuery = { ...req.query };
    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    // console.log(reqQuery);
    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    query = Hotel.find(JSON.parse(queryStr))
        .populate({
            path: "booking",
            select: "_id",
        })
        .populate({
            path: "review",
        })
        .populate({
            path: "roomType",
        });
    //Select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("name");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    //Executing query
    try {
        const total = await Hotel.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const hotels = await query;

        //Calculate BookCount
        for (let hotel of hotels) {
            let totalBook = 0;
            const bookings = await Booking.find({ hotel: hotel._id });

            for (let booking of bookings) {
                totalBook += 1;
            }
            //console.log(`Total booking of all hotels: ${totalBook}`);
            await Hotel.findByIdAndUpdate(hotel._id.toString(), {
                bookCount: totalBook,
            });
        }

        //Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        // console.log(req.query);

        res.status(200).json({
            success: true,
            capacity: total,
            data: hotels,
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Single hotels
//@route GET /api/v1/hotels/:id
//@access Public
exports.getHotel = async (req, res, next) => {
    //Calculate BookCount
    // Get all hotels
    const hotels = await Hotel.findById(req.params.id);

    let totalBook = 0;
    const bookings = await Booking.find({ hotel: hotels._id });

    for (let booking of bookings) {
        totalBook += 1;
    }
    console.log(`Total booking of all hotels: ${totalBook}`);
    await Hotel.findByIdAndUpdate(req.params.id, { bookCount: totalBook });

    // Temporary
    let totalCapacity = 0;
    const roomTypes = await RoomType.find({ hotel: hotels._id });

    for (let roomType of roomTypes) {
        totalCapacity += roomType.roomLimit;
    }
    console.log(`Total capacity of all hotels: ${totalCapacity}`);
    await Hotel.findByIdAndUpdate(req.params.id, { capacity: totalCapacity });

    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate({
                path: "booking",
                select: "_id",
            })
            .populate({
                path: "roomType",
            });
        if (!hotel) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Create new hotels
//@route POST /api/v1/hotels/:id
//@access Private
exports.createHotel = async (req, res, next) => {
    //console.log("a");
    var data = req.body; /*
    if (req.file && req.file.filename) {
        data.file = req.file.filename;
    } else {
        // Handle the error condition here
        return res
            .status(400)
            .json({ error: "Please add a picture to the hotel" });
    }*/
    try {
        const hotel = await Hotel.create(data);
        res.status(201).json({
            success: true,
            data: hotel,
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Update hotels
//@route PUT /api/v1/hotels/:id
//@access Private
exports.updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!hotel) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Delete hotels
//@route Delete /api/v1/hotels/:id
//@access Private
exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `Bootcamp not found with id of ${req.params.id}`,
            });
        }
        await hotel.deleteOne();
        if (hotel?.file) {
            await fs.unlink("./uploads/" + hotel.file, (err) => {
                if (err) {
                    res.status(400).json({ success: false });
                }
            });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
