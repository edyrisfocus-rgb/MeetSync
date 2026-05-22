export type UserRole = 'super_admin' | 'admin' | 'staff' | 'member' | 'viewer';

export type ApprovalStatus = 'draft' | 'review' | 'approved' | 'published';

export type NotificationType = 'email' | 'whatsapp' | 'in_app';

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  tenantId: string;
  organizationName?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
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
  createdAt: string;
}

export interface Document {
  _id: string;
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
  status: ApprovalStatus;
  reviewedBy?: string;
  approvedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: 'article' | 'news' | 'banner' | 'page';
  tenantId: string;
  authorId: string;
  authorName: string;
  status: ApprovalStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  pendingApprovals: number;
  totalStorage: number;
  recentLogs: ActivityLog[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}
