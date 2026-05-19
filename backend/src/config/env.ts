import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: parseInt(process.env.PORT ?? '5001', 10),
  mongoUri: isProduction
    ? getEnv('MONGO_URI')
    : getEnv('MONGO_URI', 'mongodb://localhost:27017/gigflow'),
  jwtSecret: isProduction
    ? getEnv('JWT_SECRET')
    : getEnv('JWT_SECRET', 'dev_secret_change_me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  isProduction,
};
