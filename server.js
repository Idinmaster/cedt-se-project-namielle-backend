const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const hotels = require("./routes/hotels");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");
const otp = require("./routes/otp");
const cors = require("cors");
const stripe = require("./routes/stripe");
const roomTypeRoutes = require("./routes/roomTypes");
const discounts = require("./routes/discounts");

//Load env vars
dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use((req, res, next) => {
    if (req.originalUrl === "/api/v1/stripe/webhook") {
        next();
        // Do nothing with the body because I need it in a raw state.
    } else {
        express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
    }
});
app.use(cookieParser()); // add cookie parser
app.use(cors());
app.use("/api/v1/discounts", discounts);
app.use("/api/v1/hotels", hotels); // add routes path files
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/auth", auth);
app.use("/api/v1/review", reviews);
app.use("/api/v1/otp", otp);
app.use("/api/v1/stripe", stripe);
app.use("/api/v1/roomTypes", roomTypeRoutes);

//swagger documentation
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'Hotel Booking API',
            description: 'Hotel Booking API Information',
            version: '1.0.0',
            
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
            },
        ],
    },
    apis: ["./routes/*.js"]

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log(
        "Server running in ",
        process.env.NODE_ENV,
        "on " + process.env.HOST + ":" + PORT
    )
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
