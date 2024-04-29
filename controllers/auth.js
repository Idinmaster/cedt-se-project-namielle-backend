const Otp = require("../models/Otp");
const User = require("../models/User");

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, tel, otp } = req.body;
        // const token = user.getSignedJwtToken();
        // res.status(200).json({ success: true, token });
        const otpResponse = await Otp.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);
        if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
            return res.status(400).json({
                success: false,
                message: "invalid OTP",
            });
        }
        //Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            tel,
            otp,
        });
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Check is null
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
            });
        }

        //Check for user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res
                .status(400)
                .json({ success: false, error: "cannot find user" });
        }

        //Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, error: "Invalid credentials" });
        }

        // Ceate Token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({ success: true, token });
        sendTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "Cannot convert email or password to string.",
        });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        id: user._id,
    });
};

//@desc Get current logged in user
//@route GET /api/v1/auth/me
//@access Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
};

exports.checkEmail = async (req, res, next) => {
    const email = req.query.email;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    } else {
        return res.status(200).json({
            success: true,
            message: "Email is available",
        });
    }
};
