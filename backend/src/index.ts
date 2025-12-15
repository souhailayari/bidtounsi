import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import vehicleRoutes from './routes/vehicles';
import contactRoutes from './routes/contact';
import { corsOptions, helmetOptions, limiter } from './config/security';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration de base
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting sur les routes d'API
app.use('/api', limiter);

// Logger pour le développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'BidTounsi backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);

// Démarrage du serveur avec connexion à MongoDB
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
