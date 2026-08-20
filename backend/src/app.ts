import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source.ts';
import userRouter from './modules/users/users.routes.ts';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/users', userRouter);

try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
}

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.status(200).json({ hello: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
