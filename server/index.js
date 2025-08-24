import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import apiRouter from './src/router/api.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {createPassportJwtStrategy} from './src/auth/auth.passport.js';
import errorHandler from './src/middleware/error.handler.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use('/api/v1', apiRouter);
app.use(errorHandler);

passport.use(createPassportJwtStrategy());

const port = process.env.PORT;
const host = process.env.HOST;

db.sync({alter: true})
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    });