const Discount = require("../models/Discount");

exports.getDiscounts = async (req, res, next) => {
    let query;
    //Copy req.query
    const reqQuery = { ...req.query };
    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);
    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    query = Discount.find(JSON.parse(queryStr)); // ใช้ Discount แทน Hotel

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
        const total = await Discount.countDocuments(); // ใช้ Discount แทน Hotel
        query = query.skip(startIndex).limit(limit);
        const discounts = await query;
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

        console.log(req.query);

        res.status(200).json({
            success: true,
            capacity: total,
            data: discounts,
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.getDiscount = async (req, res, next) => {
    // Get all discount
    const discounts = await Discount.findById(req.params.id);

    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: discount });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.createDiscount = async (req, res, next) => {
    var data = req.body;

    const oldDiscount = await Discount.findOne({
        code: data.code
    });

    if(oldDiscount){
        const discount = await Discount.findByIdAndUpdate(oldDiscount, data, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            data: discount,
        });
    } else {
        const discount = await Discount.create(data);
        res.status(201).json({
            success: true,
            data: discount,
        });
    }
};

exports.updateDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!discount) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: discount });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

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
