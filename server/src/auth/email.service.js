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
            from: `"Inventory App" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: __('auth.email.passwordReset.subject'),
            text: __('auth.email.passwordReset.text', `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`),
            html: __('auth.email.passwordReset.html', `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`)
        };
        return transporter.sendMail(mailOptions);
    },

    sendVerificationEmail: (email, code) => {
        const mailOptions = {
            from: `"Inventory App" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: __('auth.email.emailVerification.subject'),
            text: __('auth.email.emailVerification.text', code),
            html: __('auth.email.emailVerification.html', code)
        };
        return transporter.sendMail(mailOptions);
    }
}

export default service;