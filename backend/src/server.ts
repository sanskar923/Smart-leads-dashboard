import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`GigFlow API running on port ${env.port} [${env.nodeEnv}]`);
  });
};

startServer();
