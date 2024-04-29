/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *        - checkInDate
 *        - checkOutDate
 *        - user
 *        - hotel
 *        - roomType
 *       properties:
 *         checkInDate:
 *           type: string
 *           description: Check-in date
 *         checkOutDate:
 *           type: string
 *           description: Check-out date
 *         user:
 *           type: string
 *           description: User ID
 *         hotel:
 *           type: string
 *           description: Hotel ID
 *         roomType:
 *           type: string
 *           description: roomType
 *         createdAt:
 *           type: Date
 *           format: date
 *           example: '2023-08-20'
 *           description: Date of creation (default is current date-time)
 */
 
const express = require("express");
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/bookings");


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

/** 
 * @swagger
 * /bookings:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all bookings
 *   tags: [Bookings]
 *   responses:
 *     200:
 *       description: Successfullt get all bookings
 *     401:
 *       description: Not authorized
 *     404:
 *      description: No bookings found
 *     500:
 *      description: Server error
 */

/** 
 * @swagger
 * /hotels/{id}/bookings:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all bookings from hotel
 *   tags: [Bookings]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the hotel
 *   responses:
 *     200:
 *       description: Successfullt get all bookings
 *     401:
 *       description: Not authorized
 *     404:
 *      description: No bookings found
 *     500:
 *      description: Server error
 */

/**  
 * @swagger
 * /bookings:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: The booking was successfully created
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */


router
    .route("/")
    .get(protect, getBookings)
    .post(protect, authorize("admin", "user"), addBooking);



/** 
 * @swagger
 * /bookings/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the booking to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A booking to return
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /bookings/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the booking to update
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              anyOf:
 *                - $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: booking updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the booking to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: booking deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
*/
router
    .route("/:id")
    .get(protect, getBooking)
    .put(protect, authorize("admin", "user"), updateBooking)
    .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;

