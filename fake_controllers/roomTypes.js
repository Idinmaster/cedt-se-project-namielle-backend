const RoomType = require("../fake_models/RoomType");

//@desc Create new room type
//@route POST /api/v1/roomTypes
//@access Private
exports.addRoomType = async (req, res, next) => {
    const { name, personLimit, price, roomLimit, hotel } = req.body;

    if (!name || !(name && name.length <= 50) || personLimit <= 0 || price <= 0 || roomLimit <= 0 || !hotel) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields with valid values, including 'hotel'",
        });
    }

    try {
        const roomType = await RoomType.create({ name, personLimit, price, roomLimit, hotel });
        res.status(201).json({
            success: true,
            data: roomType,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
