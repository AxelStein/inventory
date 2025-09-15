import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import apiRouter from './src/router/api.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {createPassportJwtStrategy} from './src/auth/auth.passport.js';
import errorHandler from './src/middleware/error.handler.js';
import translation from "./src/translation/translation.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use('/locales', express.static(path.join(__dirname, 'public', 'locales'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  }
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(translation.init);
app.use('/api/v1', apiRouter);
app.use(errorHandler);

passport.use(createPassportJwtStrategy());

const port = process.env.PORT;
const host = process.env.HOST;

db.sync() // {alter: true}
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    });