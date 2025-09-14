import express from 'express';
import guestRouter from './guest/guest.router.js';
import memberRouter from './member/member.router.js';
import adminRouter from './admin/admin.router.js';
import checkHasAuth from '../middleware/check.auth.js';
import checkIsAdmin from '../middleware/check.admin.js';
import odooRouter from './odoo/odoo.router.js';

const router = express.Router();
router.use('/guest', guestRouter);
router.use('/member', checkHasAuth(), memberRouter);
router.use('/admin', checkHasAuth(), checkIsAdmin(), adminRouter);
router.use('/odoo', odooRouter);

export default router;