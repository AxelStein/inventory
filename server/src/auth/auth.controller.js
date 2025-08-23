import express from 'express';
import authService from './auth.service.js';

const setCookieToken = (res, data) => {
    res.cookie('token', data.token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.send(data);
}

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    signIn: async (req, res) => {
        const { email, password } = req.body;
        setCookieToken(res, await authService.signIn(email, password));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    signUp: async (req, res) => {
        const { name, email, password } = req.body;
        setCookieToken(res, await authService.signUp(name, email, password));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    signOut: (req, res) => {
        res.clearCookie('token');
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    googleSignIn: async (req, res) => {
        console.log(req.user);
        setCookieToken(res, await authService.googleSignIn(req.user));
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
    }
}

export default controller;