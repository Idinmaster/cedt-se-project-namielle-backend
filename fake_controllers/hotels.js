const Hotel = require("../fake_models/Hotel");

//@desc Create new hotels
//@route POST /api/v1/hotels/:id
//@access Private
exports.createHotel = async (req, res, next) => {
    //console.log("a");
    var data = req.body;
    const { name, city, address, tel, capacity, file } = req.body;
    if (
        !name ||
        (name && name.length > 50) ||
        !city ||
        (city && city.length > 50) ||
        !address ||
        !tel ||
        !capacity ||
        capacity <= 0 ||
        !file
    ) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid data" });
    }
    try {
        const hotel = await Hotel.create(data);
        res.status(201).json({
            success: true,
            data: data,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
