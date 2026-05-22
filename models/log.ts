import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  tenantId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'warning';
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    tenantId: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ['success', 'failed', 'warning'], default: 'success' },
  },
  { timestamps: true }
);

LogSchema.index({ tenantId: 1, createdAt: -1 });

const LogModel: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
export default LogModel;
