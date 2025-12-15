import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  title: string;
  description: string;
  make: string;
  vehicleModel: string;
  year: number;
  price: number;
  seller: mongoose.Schema.Types.ObjectId;
  images: string[];
  features: string[];
  condition: 'new' | 'used';
  mileage?: number;
  location: string;
  status: 'available' | 'pending' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Titre requis'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description requise']
    },
    make: {
      type: String,
      required: [true, 'Marque requise']
    },
    vehicleModel: {
      type: String,
      required: [true, 'Modèle requis']
    },
    year: {
      type: Number,
      required: [true, 'Année requise']
    },
    price: {
      type: Number,
      required: [true, 'Prix requis'],
      min: [0, 'Prix invalide']
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    images: [{
      type: String
    }],
    features: [{
      type: String
    }],
    condition: {
      type: String,
      enum: ['new', 'used'],
      required: true
    },
    mileage: {
      type: Number,
      min: [0, 'Kilométrage invalide']
    },
    location: {
      type: String,
      required: [true, 'Localisation requise']
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold'],
      default: 'available'
    }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
