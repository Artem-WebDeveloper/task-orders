import app from './app.ts';
import { AppDataSource } from './data-source.ts';
import { redisClient } from './redis-client.ts';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    await redisClient.connect();
    console.log('Redis connected successfully!');

    const server = app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.log('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('Fatal Error during application startup:', err);
    process.exit(1);
  }
};

startServer();
