import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      return res.status(400).json({
        status: 'error',
        message: 'Données invalides',
        errors: errorMessage
      });
    }

    next();
  };
};

// Schémas de validation
export const schemas = {
  userRegister: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      }),
    name: Joi.string().min(2).required(),
    phoneNumber: Joi.string().pattern(/^[0-9+]{8,}$/),
  }),

  vehicle: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(20).required(),
    price: Joi.number().min(0).required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear() + 1).required(),
    mileage: Joi.number().min(0),
    location: Joi.string().required(),
    features: Joi.array().items(Joi.string()),
    condition: Joi.string().valid('new', 'used').required(),
  })
};