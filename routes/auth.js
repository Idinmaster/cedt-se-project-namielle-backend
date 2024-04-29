/**
 * @swagger
 * components:
 *   schemas:
 *    User:
 *     type: object
 *     required:
 *      - name
 *      - email
 *      - tel
 *      - password
 *     properties:
*         name:
*           type: string
*           description: Name of user
*         email:
*           type: string
*           description: Email of user
*         tel:
*           type: string
*           description: Telephone number of user
*         role:
*           type: string
*           description: Role of user (admin or user), default is user
*         password:
*           type: string
*           description: Password of user 
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
 */

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
 * @swagger
 * 
 * tags:
 *  - name: OTP
 *    description: OTP API
 *  - name: User
 *    description: User API
 *  - name: Bookings
 *    description: Booking Managing API
 *  - name: Hotels
 *    description: Hotel Managing API
 *  - name: Reviews
 *    description: Review Manging API
 *  - name: Discounts
 *    description: Discount Managing API
 *  - name: RoomType
 *    description: RoomType Managing API
 *  - name: Stripe
 *    description: Stripe Payment API
 */
 




const express = require("express");
const {
    register,
    login,
    getMe,
    logout,
    checkEmail,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");




router.post("/register", register);
/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             allOf:
*               - $ref: '#/components/schemas/User'
*               - type: object
*                 properties:
*                   otp: 
*                     type: string
*                     description: OTP sent to the user             
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               allOf:
*               - $ref: '#/components/schemas/User'
*               - type: object
*                 properties:
*                   otp:
*                     type: string
*       400:
*         description: Invalid OTP, Client error
*       500:
*         description: Some server error
*/


router.post("/login", login);
/**
* @swagger
* /auth/login:
*   post:
*     summary: Log-in to the system
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties: 
*               email: 
*                   type: string
*               password: 
*                   type: string
*     responses:
*       200:
*         description: Log-in Successfully
*       400:
*         description: Some client error
*       401:
*         description: Invalid credentials
*       500:
*         description: Some server error
*/
router.get("/me", protect, getMe);
/**
* @swagger
* /auth/me:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Return information about me
*     tags: [User]
*     responses:
*       200:
*         description: My user profile
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'

*/

router.get("/email", checkEmail);
/**
* @swagger
* /auth/email:
*   get:
*     summary: Check email
*     tags: [User]
*     parameters:
*       - in: query
*         name: email
*         schema:
*           type: string
*         required: true
*         description: Email of user
*     responses:
*       200:
*         description: Email is available
*       400:
*         description: Email already exists
*/
router.get("/logout", logout);
/**
* @swagger
* /auth/logout:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Log user out / clear cookie
*     tags: [User]
*     responses:
*       200:
*         description: Log-out Successfully
*/
module.exports = router;



