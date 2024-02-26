const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PWD,
        },
    });

    async function main() {
        const info = await transporter.sendMail({
            from: '"Hey 👻" <huytq0104@gmail.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        });

        console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
});

module.exports = sendEmail;

