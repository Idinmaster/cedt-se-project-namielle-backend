const Discount = require("../fake_models/Discount");




exports.deleteDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(404).json({
                success: false,
                message: `discount not found with id of ${req.params.id}`,
            });
        }
        await discount.deleteOne();
        /*if (discount?.file) {
            await fs.unlink("./uploads/" + discount.file, (err) => {
                if (err) {
                    res.status(400).json({ success: false });
                }
            });
        }*/
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
