import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import apiRouter from './src/router/api.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {createPassportGoogleStrategy, createPassportJwtStrategy} from './src/auth/auth.passport.js';
import errorHandler from './src/middleware/error.handler.js';
import googleAuthRouter from "./src/router/google.auth.router.js";
import EmailVerification from "./src/auth/email_verification/email.verification.model.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use('/api/v1', apiRouter);
app.use('/auth/google', googleAuthRouter)
app.use(errorHandler);

passport.use(createPassportJwtStrategy());
passport.use(createPassportGoogleStrategy());

const port = process.env.PORT;
const host = process.env.HOST;

db.sync({alter: true})
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    });