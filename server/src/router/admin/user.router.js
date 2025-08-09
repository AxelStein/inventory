import express from 'express';
import controller from '../../user/user.controller.js';

const router = express.Router();
router.put('/:userId/block', controller.blockUser);
router.put('/:userId/unblock', controller.unblockUser);
router.put('/:userId/change-role', controller.changeUserRole);
router.delete('/:userId', controller.deleteUser);
router.get('/list', controller.getUsers);

export default router;