import 'reflect-metadata';
import express from 'express';
import userRouter from './modules/users/users.routes.ts';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/users', userRouter);

export default app;
