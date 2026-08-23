import express from 'express';
import * as usersController from './users.controller.ts';
import { protect, restrictTo } from '../../middlewares/auth.middleware.ts';

const router = express.Router();

router.use(protect);

router.get('/teams', restrictTo('operator'), usersController.getTeams);
router.get('/', restrictTo('operator'), usersController.getUsers);

export default router;
