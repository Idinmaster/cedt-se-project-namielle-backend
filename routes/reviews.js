const express = require("express");
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
    hideReview,
} = require("../controllers/reviews");

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *        - user
 *        - hotel
 *        - stars
 *        - description
 *       properties:
 *         user:
 *           type: string
 *           description: user ID
 *         hotel:
 *           type: string
 *           description: hotel ID
 *         stars:
 *           type: number
 *           description: reviews star (1-5)
 *         description:
 *           type: string
 *           description: review description
 *         isHidden:
 *           type: boolean
 *           description: Review visibility
 *         createdAt:
 *           type: Date
 *           format: date
 *           example: '2023-08-20'
 *           description: Date of creation (default is current date-time)
 */

/** 
 * @swagger
 * /review:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all reviews
 *   tags: [Reviews]
 *   responses:
 *     200:
 *       description: Successfullt get all reviews
 *     401:
 *       description: Not authorized
 *     404:
 *      description: No reviews found
 *     500:
 *      description: Server error
 */

/** 
 * @swagger
 * /hotels/{id}/review:
 *  get:
 *   summary: Get all reviews from hotel
 *   tags: [Reviews]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the hotel
 *   responses:
 *     200:
 *       description: Successfullt get all reviews
 *     401:
 *       description: Not authorized
 *     404:
 *      description: No reviews found
 *     500:
 *      description: Server error
 */

/**  
 * @swagger
 * /review:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: The review was successfully created
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(getReviews)
    .post(protect, authorize("admin", "user"), addReview);

    
/** 
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to return
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A review to return
 *       401:
 *         description: Not authorized
 *       404:
 *         description: review not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /review/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              anyOf:
 *                - $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: review updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: review not found
 *       500:
 *         description: Server error
*/

/** 
 * @swagger
 * /review/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: review deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: review not found
 *       500:
 *         description: Server error
*/
router
    .route("/:id")
    .get(getReview)
    .put(protect, authorize("admin", "user"), updateReview)
    .delete(protect, authorize("admin", "user"), deleteReview);


/**
 * @swagger
 * /review/{id}/hide:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: Hide a review
 *     tags: [Reviews]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the review to hide
 *     schema:
 *       type: string
 *     responses:
 *      200: 
 *        description: review hidden
 *      401:
 *        description: Not authorized
 *      404:
 *        description: review not found
 *      500:
 *        description: Server error
 * 
 */
router.put("/:id/hide", protect, authorize("admin"), hideReview);

module.exports = router;
