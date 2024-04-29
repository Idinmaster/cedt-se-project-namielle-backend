/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *        - name
 *        - city
 *        - address
 *        - tel
 *        - capacity
 *        - file
 *        - price
 *        - bookCount
 *        - priority
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the hotel
 *         city:
 *           type: string
 *           description: City of the hotel address
 *         address:
 *           type: string
 *           description: Address of the hotel
 *         tel:
 *           type: string
 *           description: telephone number of the hotel
 *         capacity:
 *           type: number
 *           description: amount of rooms available
 *         file:
 *           type: string
 *           description: uri of the file location for hotel image
 *         price:
 *           type: number
 *           description: price of the hotel room
 *         bookCount:
 *           type: number
 *           description: amount of bookings made
 *         priority:
 *           type: number
 *           description: priority of the hotel recommended section
 */
 



const express = require("express");




const {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel,
} = require("../controllers/hotels");

const bookingRouter = require("./bookings");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Re-route into other resource routers
router.use("/:hotelId/bookings", bookingRouter);
router.use("/:hotelId/reviews", reviewRouter);


/**
 * @swagger
 * /hotels:
 *  get:
 *    summary: get all hotels 
 *    tags: [Hotels]
 *    responses:
 *      200:
 *        description: Successfully get all hotels
 *      400:
 *        description: Client error
 * 
 */

/**  
 * @swagger
 * /hotels:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: The hotel was successfully created
 *       400:
 *         description: Client error
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
    .route("/")
    .get(getHotels)
    .post(protect, authorize("admin"), upload, createHotel);


/** 
 * @swagger
 * /hotels/{id}:
 *   get:    
 *     summary: Get a hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the hotel to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: hotel data returned
 *       401:
 *         description: Not authorized
 *       404:
 *         description: hotels not found
 *       500:
 *         description: Server error
*/
/** 
 * @swagger
 * /hotels/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the hotel to update
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              anyOf:
 *                - $ref: '#/components/schemas/Hotel'
 *     responses:
 *       200:
 *         description: hotel updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: hotel not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the hotel to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: hotel deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: hotel not found
 *       500:
 *         description: Server error
*/    
router
    .route("/:id")
    .get(getHotel)
    .put(protect, authorize("admin"), updateHotel)
    .delete(protect, authorize("admin"), deleteHotel);
module.exports = router;

