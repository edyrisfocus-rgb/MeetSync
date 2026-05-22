import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  domain?: string;
  plan: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    primaryColor: { type: String, default: '#6366f1' },
    domain: { type: String },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    isActive: { type: Boolean, default: true },
    settings: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const TenantModel: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
export default TenantModel;
