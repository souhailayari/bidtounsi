import rateLimit from 'express-rate-limit';
import { Express, Request, Response, NextFunction } from 'express';

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Limite à 100 requêtes
  windowMs: 15 * 60 * 1000, // par fenêtre de 15 minutes
  message: 'Trop de requêtes depuis cette IP'
});

// Middleware de vérification du content-type
const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      return res.status(400).json({
        status: 'error',
        message: 'Content-Type doit être application/json'
      });
    }
  }
  next();
};

export const configureSecurity = (app: Express) => {
  // Appliquer le rate limiting sur les routes d'API
  app.use('/api', limiter);
  
  // Vérifier le content-type
  app.use(checkContentType);
  
  // Headers de sécurité basiques
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });
};