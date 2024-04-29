/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *        - session_id
 *        - checkInDate
 *        - checkOutDate
 *        - user
 *        - hotel
 *        - roomType
 *       properties:
 *         session_id:
 *           type: string
 *           description: ID of the transaction session
 *         checkInDate:
 *           type: string
 *           description: check in date of the booking of the transaction
 *         checkOutDate:
 *           type: string
 *           description: check out date of the booking of the transaction
 *         user:
 *           type: ObjectID
 *           description: user objectID to populate in database
 *         hotel:
 *           type: ObjectID
 *           description: hotel objectID to populate in database       
 *         roomType:
 *           type: string
 *           description: room type of the booking 
 *         stripe_id:
 *           type: string
 *           description: stripe payment intent ID
 */



const express = require("express");
const {
    createCheckoutSession,
    handleStripeWebhook,
} = require("../controllers/stripe");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");


/** 
 * @swagger
 * /stripe/create-checkout-session:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Create a stripe checkout session
 *    tags: [Stripe]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Booking'
 *    responses:
 *      200:
 *        description: successfully created session
 *      400:
 *        description: Client error
 *      401:
 *        description: Not authorized
 *      404:
 *        description: Hotel from booking is not found
 *      500:
 *        description: Server error
 * 
 * 
*/
router
    .route("/create-checkout-session")
    .post(protect, authorize("admin", "user"), createCheckoutSession);

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *    summary: Stripe webhook handler
 *    tags: [Stripe]
 *    parameters:
 *      - in: header
 *        name: stripe-signature
 *        required: true
 *        description: Stripe signature
 *        schema:
 *          type: string
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            description: Stripe request body with endpoint secret to construct event
 *    responses:
 *      200:
 *        description: Webhook successfully handled, Order fullfilled
 *      400:
 *        description: Client error
 *              
 * 
 * 
*/
router
    .route("/webhook")
    .post(express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
