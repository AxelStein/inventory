import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    }
});

const service = {

    sendRestorePasswordEmail: (email, token) => {
        const mailOptions = {
            'from': `"Inventory App" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password reset',
            text: `Your restore password link: ${process.env.CLIENT_URL}/reset-password?token=${token}`,
            html: `<div>Click <a href="${process.env.CLIENT_URL}/reset-password?token=${token}">here</a> to restore your password</div>`
        };
        return transporter.sendMail(mailOptions);
    },

    sendVerificationEmail: (email, code) => {
        const mailOptions = {
            'from': `"Inventory App" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Email verification',
            text: `Your signup confirmation code: ${code}`,
            html: `Your signup confirmation code: <strong>${code}</strong>`
        };
        return transporter.sendMail(mailOptions);
    }
}

export default service;