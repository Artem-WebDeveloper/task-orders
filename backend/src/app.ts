import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source.ts';

const app = express();

try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
}

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
