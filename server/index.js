import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import apiRouter from './src/router/api.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {
    createFacebookStrategy,
    createPassportGoogleStrategy,
    createPassportJwtStrategy
} from './src/auth/auth.passport.js';
import errorHandler from './src/middleware/error.handler.js';
import authRouter from "./src/router/provider_auth/provider.auth.router.js";
import providerAuthRouter from "./src/router/provider_auth/provider.auth.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use('/api/v1', apiRouter);
app.use('/auth', providerAuthRouter);
app.use(errorHandler);

passport.use(createPassportJwtStrategy());
passport.use(createPassportGoogleStrategy());
passport.use(createFacebookStrategy());

const port = process.env.PORT;
const host = process.env.HOST;

db.sync({alter: true})
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    });