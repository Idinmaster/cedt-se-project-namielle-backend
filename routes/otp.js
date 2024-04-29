const express = require("express");
const otpController = require("../controllers/otp");
const router = express.Router();


/**
* @swagger
* components:
*   schemas:
*     OTP:
*       type: object
*       required:
*         - email
*         - otp
*       properties:
*         email:
*           type: string
*           description: Email of user
*         otp:
*           type: string
*           description: Email of user
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
*/



/**
* @swagger
* /otp/sent-otp:
*   post:
*     summary: Send an otp to user email
*     tags: [OTP]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 description: Email of user
*     responses:
*       200:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   description: Success of the response
*                 message:
*                   type: string
*                   description: Message of the response
*                 otp:
*                   type: string
*                   description: OTP sent to the user
*       500:
*         description: Some server error
*/


router.post("/sent-otp", otpController.sendOTP);
module.exports = router;

