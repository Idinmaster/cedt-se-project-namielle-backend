const Review = require("../models/Review");
const Hotel = require("../models/Hotel");

//@desc Get all reviews
//@route GET /api/v1/reviews
//@access Public
exports.getReviews = async (req, res, next) => {
    let query;
    if (req.params.hotelId) {
        console.log(req.params.hotelId);
        query = Review.find({ hotel: req.params.hotelId }).populate("user");
    } else {
        query = Review.find().populate({
            path: "hotel",
            select: "name address",
        });
    }

    try {
        const reviews = await query;
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Canot find reviews",
        });
    }
};

//@desc Get single review
//@route GET /api/v1/review/:id
//@access Public
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).populate({
            path: "hotel",
            select: "name address",
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Review" });
    }
};

//@desc add reviews
//@route POST /api/v1/hotels/:hotelID/reviews/
//@access Private
exports.addReview = async (req, res, next) => {
    try {
        req.body.hotel = req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`,
            });
        }
        const existedReview = await Review.findOne({
            user: req.user.id,
            hotel: req.params.hotelId,
        });
        if (existedReview) {
            return res.status(400).json({
                success: false,
                message: "This user has already made a review for this hotel",
            });
        }

        req.body.user = req.user.id;

        const review = await Review.create(req.body);
        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "cannot create review",
        });
    }
};

//@desc Update review
//@route PUT /api/v1/review/:id
//@access Private
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`,
            });
        }

        // Make sure user is review owner
        if (
            review.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this review`,
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot update Review" });
    }
};

//@desc Delete review
//@route DELETE /api/v1/review/:id
//@access Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`,
            });
        }

        // Make sure user is review owner
        if (
            review.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this review`,
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot delete Review" });
    }
};

//@desc Hide review
//@route PUT /api/v1/review/:id/hide
//@access Private
exports.hideReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review found with the id of ${req.params.id}`,
            });
        }

        if (req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "User not authorized to hide this review",
            });
        }

        review.isHidden = !review.isHidden;
        await review.save();

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error hiding review",
        });
    }
};
