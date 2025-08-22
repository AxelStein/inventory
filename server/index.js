import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import apiRouter from './src/router/api.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {createPassportGoogleStrategy, createPassportJwtStrategy} from './src/auth/auth.passport.js';
import errorHandler from './src/middleware/error.handler.js';

import User from './src/user/user.model.js';
import Inventory from './src/inventory/inventory.model.js';
import Item from './src/inventory/item/item.model.js';
import ItemLike from './src/inventory/item/like/item.like.model.js';
import Category from './src/inventory/category/category.model.js';
import CustomId from './src/inventory/custom_id/custom.id.model.js';
import Post from './src/inventory/post/post.model.js';
import PostComment from './src/inventory/post/comment/comment.model.js';
import Tag from './src/inventory/tag/tag.model.js';
import WriteAccess from './src/inventory/write_access/write.access.model.js';
import ItemSequence from './src/inventory/custom_id/sequence/item.sequence.model.js';
import {pusher} from "./src/events/pusher.js";
import googleAuthRouter from "./src/router/google.auth.router.js";

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

db.sync()
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    });