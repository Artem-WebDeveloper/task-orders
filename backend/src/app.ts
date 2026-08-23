import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import authRouter from './modules/auth/auth.routes.ts';
import userRouter from './modules/users/users.routes.ts';
import orderRouter from './modules/orders/orders.routes.ts';
import globalErrorHandler from './middlewares/error.middleware.ts';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

app.use(globalErrorHandler);

export default app;
