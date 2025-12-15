/**
 * Modèle AdminKey - Stocke les clés administrateur générées
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminKey extends Document {
  key: string;
  adminId: mongoose.Schema.Types.ObjectId;
  email: string;
  name: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
}

const AdminKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
    default: null,
  },
});

// Index pour nettoyer les clés expirées
AdminKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminKey = mongoose.model<IAdminKey>('AdminKey', AdminKeySchema);
