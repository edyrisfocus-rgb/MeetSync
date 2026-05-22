import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import DocumentModel from '@/models/document';
import LogModel from '@/models/log';
import { NextResponse } from 'next/server';

const statusFlow = ['draft', 'review', 'approved', 'published'] as const;

type DocumentStatus = (typeof statusFlow)[number];

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  tenantId?: string;
};

function getSessionUser(session: { user?: SessionUser } | null) {
  if (!session?.user?.tenantId) return null;
  return session.user;
}

function getNextStatus(status: DocumentStatus) {
  const index = statusFlow.indexOf(status);
  return index >= 0 && index < statusFlow.length - 1 ? statusFlow[index + 1] : null;
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = getSessionUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const document = await DocumentModel.findOne({ _id: id, tenantId: user.tenantId });
  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  const nextStatus = getNextStatus(document.status);
  if (!nextStatus) return NextResponse.json({ error: 'Document is already published' }, { status: 400 });

  document.status = nextStatus;
  if (nextStatus === 'approved') document.approvedBy = user.id || user.email || 'unknown';
  if (nextStatus === 'published') document.publishedAt = new Date();
  if (nextStatus === 'review') document.reviewedBy = user.id || user.email || 'unknown';
  await document.save();

  await LogModel.create({
    userId: user.id || user.email || 'unknown',
    userName: user.name || 'Unknown User',
    userEmail: user.email || '',
    tenantId: user.tenantId,
    action: 'updated_status',
    resource: 'document',
    resourceId: document._id.toString(),
    details: `${document.title} -> ${nextStatus}`,
    status: 'success',
  });

  return NextResponse.json({ document });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = getSessionUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const document = await DocumentModel.findOneAndDelete({ _id: id, tenantId: user.tenantId });
  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  await LogModel.create({
    userId: user.id || user.email || 'unknown',
    userName: user.name || 'Unknown User',
    userEmail: user.email || '',
    tenantId: user.tenantId,
    action: 'deleted',
    resource: 'document',
    resourceId: document._id.toString(),
    details: document.title,
    status: 'warning',
  });

  return NextResponse.json({ ok: true });
}
