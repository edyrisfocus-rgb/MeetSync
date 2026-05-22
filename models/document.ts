import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  description?: string;
  fileType: 'pdf' | 'image' | 'doc' | 'other';
  fileUrl: string;
  fileSize: number;
  tenantId: string;
  uploadedBy: string;
  uploadedByName: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'review' | 'approved' | 'published';
  reviewedBy?: string;
  approvedBy?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileType: { type: String, enum: ['pdf', 'image', 'doc', 'other'], required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    tenantId: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadedByName: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'review', 'approved', 'published'], default: 'draft' },
    reviewedBy: { type: String },
    approvedBy: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const DocumentModel: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
export default DocumentModel;
