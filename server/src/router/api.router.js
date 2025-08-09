import express from 'express';
import guestRouter from './guest/guest.router.js';
import memberRouter from './member/member.router.js';
import adminRouter from './admin/admin.router.js';

const router = express.Router();
router.use('/guest', guestRouter);
router.use('/member', memberRouter);
router.use('/admin', adminRouter);

export default router;