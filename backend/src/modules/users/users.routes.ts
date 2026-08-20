import express from 'express';
import * as usersController from './users.controller.ts';

const router = express.Router();

router.get('/teams', usersController.getTeams);
router.get('/', usersController.getUsers);

export default router;
