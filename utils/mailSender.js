const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        //transporter
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
            secure: true,
            port: 465,
        });

        let info = await transporter.sendMail({
            from: "BBQ BACON BURGER",
            to: email,
            subject: title,
            html: body,
        });
        console.log("email info: ", info);
        return info;
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = mailSender;

