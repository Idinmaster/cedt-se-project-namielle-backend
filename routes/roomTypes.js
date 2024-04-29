/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       required:
 *        - hotel
 *        - name
 *        - personLimit
 *        - price
 *        - roomLimit
 *       properties:
 *         hotel:
 *           type: string
 *           description: Hotel ID
 *         name:
 *           type: string
 *           description: RoomType name
 *         personLimit:
 *           type: number
 *           description: maximum number of people that can stay in this room
 *         price:
 *           type: number
 *           description: price of the room
 *         roomLimit:
 *           type: number
 *           description: amount of rooms available
 */
 
const express = require("express");
const {
    getRoomTypes,
    getRoomType,
    addRoomType,
    updateRoomType,
    deleteRoomType,
} = require("../controllers/roomTypes");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
/** 
 * @swagger
 * /roomTypes:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all Room Types
 *   tags: [RoomType]
 *   responses:
 *     200:
 *       description: Successfullt get all room types
 *     401:
 *       description: Not authorized
 *     404:
 *      description: No room types found
 *     500:
 *      description: Server error
 */

/**  
 * @swagger
 * /roomTypes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a room type
 *     tags: [RoomType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       201:
 *         description: The Room type was successfully created
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
    .route("/")
    .get(protect, getRoomTypes)
    .post(protect, authorize("admin", "user"), addRoomType);

/** 
 * @swagger
 * /roomTypes/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a roomTypes
 *     tags: [RoomType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the roomTypes to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A roomTypes to return
 *       401:
 *         description: Not authorized
 *       404:
 *         description: roomTypes not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /roomTypes/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a roomType
 *     tags: [RoomType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the roomType to update
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              anyOf:
 *                - $ref: '#/components/schemas/RoomType'
 *     responses:
 *       200:
 *         description: roomType updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: roomType not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /roomTypes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a roomType
 *     tags: [RoomType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the roomType to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: roomType deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: roomType not found
 *       500:
 *         description: Server error
*/    
router
    .route("/:id")
    .get(protect, getRoomType)
    .put(protect, authorize("admin", "user"), updateRoomType)
    .delete(protect, authorize("admin", "user"), deleteRoomType);

module.exports = router;
