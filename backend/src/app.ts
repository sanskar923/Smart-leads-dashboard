import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

if (env.isProduction) {
  app.set('trust proxy', 1);
}

const allowedOrigins = env.clientUrl.split(',').map((o) => o.trim());

const isOriginAllowed = (origin: string): boolean => {
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  // Allow Vercel production and preview deployments
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'GigFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
