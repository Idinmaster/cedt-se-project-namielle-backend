const Transaction = require("../models/Transaction");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");
const dotenv = require("dotenv");
const Discount = require("../models/Discount");

dotenv.config({ path: "./config/config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

//@desc create checkout session
//@route POST /api/v1/stripe/create-checkout-session
//@access Private
exports.createCheckoutSession = async (req, res) => {
    const payload = await req.body;
    const discountPercentage = await useDiscountCode(payload.discountCode);
    //create booking data
    try {
        payload.cartItems.map(async (item) => {
            const hotel = await Hotel.findById(item.hid);

            if (!hotel) {
                return res.status(404).json({
                    success: false,
                    message: `No hotel with the id of ${item.hid}`,
                });
            }

            // req.body.user = req.user.id;
            const hotelCapacity = hotel.capacity;
            const hotelExistedBookings = await Booking.find({
                hotel: item.hid,
            });
            const existedBookings = await Booking.find({ user: req.user.id });
            // console.log(item);
            if (hotelExistedBookings.length >= hotelCapacity) {
                return res.status(400).json({
                    success: false,
                    message: `The hotel with ID ${item.hid} has already reached its capacity`,
                });
            }
            if (existedBookings.length >= 3 && req.user.role !== "admin") {
                return res.status(400).json({
                    success: false,
                    message: `The user with ID ${req.user.id} has already made 3 bookings`,
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot create Booking" });
    }

    //stripe
    const lineItems = payload.cartItems.map((product) => ({
        price_data: {
            currency: "thb",
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100 * discountPercentage,
        },
        quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/mybooking?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/cart?cancel=true`,
    });

    payload.cartItems.map(async (product) => {
        await Transaction.create({
            session_id: session.id,
            checkInDate: product.checkInDate,
            checkOutDate: product.checkOutDate,
            roomType: product.roomType,
            hotel: product.hid,
            user: payload.user,
            stripe_id: "NULL",
        });
    });

    console.log(payload.cartItems);

    res.status(200).json({ success: true, sessionId: session.id });

    // await Booking.create(item);
};

//@desc get endpoint of retrieve checkout session status
//@route GET /api/v1/stripe/session-status
//@access Private
exports.getCheckoutSessionStatus = async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
    );

    res.status(200).json({
        status: session.status,
        customer_email: session.customer_details.email,
    });
};

exports.handleStripeWebhook = async (req, res) => {
    console.log("successfully received webhook event");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({success: false, message: err.message});
    }

    // console.log(event.type);

    if (event.type === "checkout.session.completed") {
        console.log("checkout session data: " + event.data.object);
        const session = event.data.object;
        if (session.payment_status === "paid") {
            const transaction = await Transaction.find({
                session_id: event.data.object.id,
            });
            transaction.forEach(async (element) => {
                console.log(element);
                element.stripe_id = event.data.object.payment_intent;
                await Transaction.findByIdAndUpdate(element.id, element, {
                    new: true,
                    runValidators: true,
                });
            });
            transaction.forEach(async (element) => {
                await fullfillOrder(element);
            });
        }
    } else if (event.type === "checkout.session.async_payment_succeeded") {
        const transaction = await Transaction.find({
            session_id: event.data.object.id,
        });
        transaction.forEach(async (element) => {
            element.stripe_id = event.data.object.payment_intent;
            await Transaction.findByIdAndUpdate(element.id, element, {
                new: true,
                runValidators: true,
            });
            await fullfillOrder(element);
        });
    }

    res.status(200).json({ received: true });
};

const fullfillOrder = async (transaction) => {
    //add Booking for each transaction
    const booking = {
        user: transaction.user,
        hotel: transaction.hotel,
        checkInDate: transaction.checkInDate,
        checkOutDate: transaction.checkOutDate,
        roomType: transaction.roomType,
        createdAt: Date.now(),
    };
    try {
        await Booking.create(booking);
    } catch (err) {
        console.log("error: " + err.message);
    }

    //Decreased roomLimit
    const roomType = await RoomType.findById(booking.roomType);
    let totalRoomLimit = roomType.roomLimit - 1;
    await RoomType.findByIdAndUpdate(booking.roomType, {
        roomLimit: totalRoomLimit,
    });
};

const useDiscountCode = async (userDiscountCode) => {
    try {
        const discounts = await Discount.find();
        const discount = discounts.find(
            (item) => item.code === userDiscountCode
        );
        if (discount) {
            console.log("percent: ", (100 - discount.percentage) / 100);
            return (100 - discount.percentage) / 100;
        }
        return 1;
    } catch (error) {
        console.error("Error fetching discount", error);
        res.status(400).json({success: false, message: err.message })
    }
};
