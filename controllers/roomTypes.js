const hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");

//@desc Get all room types
//@route GET /api/v1/roomTypes
//@access Public
exports.getRoomTypes = async (req, res, next) => {
    try {
        const roomTypes = await RoomType.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            count: roomTypes.length,
            data: roomTypes,
        });
    } catch (err) {
        console.log(err);
        return res.status(404).json({
            success: false,
            message: "Cannot find room types",
        });
    }
};

//@desc Get single room type
//@route GET /api/v1/roomTypes/:id
//@access Public
exports.getRoomType = async (req, res, next) => {
    try {
        const roomType = await RoomType.findById(req.params.id);
        if (!roomType) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: roomType });
    } catch (err) {
        res.status(404).json({ success: false });
    }
};

//@desc Create new room type
//@route POST /api/v1/roomTypes
//@access Private
exports.addRoomType = async (req, res, next) => {
    // เช็คข้อมูลที่ส่งมาก่อนทำการสร้าง
    const { name, personLimit, price, roomLimit, hotel } = req.body;

    if (!name || personLimit <= 0 || price <= 0 || roomLimit <= 0 || !hotel) {
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
        // จัดการกับข้อผิดพลาดที่อาจเกิดจาก mongoose validation หรืออื่นๆ
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};


//@desc Update room type
//@route PUT /api/v1/roomTypes/:id
//@access Private
exports.updateRoomType = async (req, res, next) => {
    try {
        const roomType = await RoomType.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!roomType) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: roomType });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Delete room type
//@route Delete /api/v1/roomTypes/:id
//@access Private
exports.deleteRoomType = async (req, res, next) => {
    try {
        const roomType = await RoomType.findById(req.params.id);
        if (!roomType) {
            return res.status(404).json({
                success: false,
                message: `Room type not found with id of ${req.params.id}`,
            });
        }
        roomType.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
