import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from '../src/routes/auth';
import adminRoutes from '../src/routes/admin';
import vehicleRoutes from '../src/routes/vehicles';
import contactRoutes from '../src/routes/contact';
import { corsOptions, helmetOptions, limiter } from '../src/config/security';
import { connectDB } from '../src/config/database';

dotenv.config();

const app: Express = express();

// Configuration de base
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export pour Vercel
export default app;
