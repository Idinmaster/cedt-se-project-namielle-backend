const express = require("express");
const {
    getDiscounts,
    getDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
} = require("../controllers/discounts");

/*
const bookingRouter = require("./bookings");
const reviewRouter = require("./reviews");
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       required:
 *        - name
 *        - info
 *        - code
 *        - percentage
 *        - image
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the code
 *         info:
 *           type: string
 *           description: Code description
 *         code:
 *           type: string
 *           description: Discount coupon code
 *         percentage:
 *           type: string
 *           description: Discount percentage
 *         image:
 *           type: string
 *           description: Image of the coupon         
 */



const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

/**
 * @swagger
 * /discounts:
 *  get:
 *    summary: Get all discounts
 *    tags: [Discounts]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: True or False
 *                capacity:
 *                  type: number
 *                  description: Total uses of discounts
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Discount'
 *                    description: get all siscounts
 *      400:
 *        description: Client error
 * 
 */

/**  
 * @swagger
 * /discounts:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a discount
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discount'
 *     responses:
 *       201:
 *         description: The coupon was successfully created
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */




router
    .route("/")
    .get(getDiscounts)
    .post(protect, authorize("admin"), upload, createDiscount);

/** 
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Get a discount
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the discount to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A coupon to return
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /discounts/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a discount
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the discount to return
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              anyOf:
 *                - $ref: '#/components/schemas/Discount'
 *     responses:
 *       200:
 *         description: coupon updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a discount
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the discount to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: coupon deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
*/

router
    .route("/:id")
    .get(getDiscount)
    .put(protect, authorize("admin"), updateDiscount)
    .delete(protect, authorize("admin"), deleteDiscount);
module.exports = router;
