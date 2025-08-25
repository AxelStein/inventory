import authService from './auth.service.js';

const setCookieToken = (res, data) => {
    if (data.token) {
        res.cookie('token', data.token, { sameSite: 'none', secure: true, httpOnly: true });
    }
    res.send(data);
}

const controller = {

    signIn: async (req, res) => {
        const { email, password } = req.body;
        setCookieToken(res, await authService.signIn(email, password));
    },

    signUp: async (req, res) => {
        const { name, email, password } = req.body;
        res.send(await authService.signUp(name, email, password, req.locale));
    },

    signOut: (req, res) => {
        res.clearCookie('token');
        res.sendStatus(200);
    },

    signInWithGoogle: async (req, res) => {
        const { token } = req.body;
        setCookieToken(res, await authService.signInWithGoogle(token, req.locale));
    },

    resetPassword: async (req, res) => {
        const { email } = req.body;
        await authService.resetPassword(email);
        res.sendStatus(200);
    },

    restorePassword: async (req, res) => {
        const { token, password } = req.body;
        await authService.restorePassword(token, password);
        res.sendStatus(200);
    },

    verifyEmail: async (req, res) => {
        const { userId, code } = req.body;
        setCookieToken(res, await authService.verifyEmail(userId, code));
    }
}

export default controller;