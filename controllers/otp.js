const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const User = require("../models/User");

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await Otp.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await Otp.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await Otp.create(otpPayload);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

