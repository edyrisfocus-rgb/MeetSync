import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import DocumentModel from '@/models/document';
import LogModel from '@/models/log';
import { NextResponse } from 'next/server';

const fileTypes = ['pdf', 'image', 'doc', 'other'] as const;

type FileType = (typeof fileTypes)[number];

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

function parseString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseFileType(value: unknown): FileType | null {
  return typeof value === 'string' && fileTypes.includes(value as FileType) ? (value as FileType) : null;
}

function parseFileSize(value: unknown) {
  const size = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(size) && size > 0 && size <= 50 * 1024 * 1024 ? Math.round(size) : null;
}

export async function GET() {
  const session = await auth();
  const user = getSessionUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const documents = await DocumentModel.find({ tenantId: user.tenantId }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const session = await auth();
  const user = getSessionUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const title = parseString((body as Record<string, unknown>).title);
  const fileType = parseFileType((body as Record<string, unknown>).fileType);
  const fileSize = parseFileSize((body as Record<string, unknown>).fileSize);
  const fileUrl = parseString((body as Record<string, unknown>).fileUrl) || '#';
  const category = parseString((body as Record<string, unknown>).category);
  const description = parseString((body as Record<string, unknown>).description);

  if (!title || !fileType || !fileSize) {
    return NextResponse.json({ error: 'Title, file type, and file size are required' }, { status: 400 });
  }

  await connectDB();
  const document = await DocumentModel.create({
    title,
    description: description || undefined,
    fileType,
    fileUrl,
    fileSize,
    tenantId: user.tenantId,
    uploadedBy: user.id || user.email || 'unknown',
    uploadedByName: user.name || user.email || 'Unknown User',
    category: category || undefined,
    status: 'draft',
  });

  await LogModel.create({
    userId: user.id || user.email || 'unknown',
    userName: user.name || 'Unknown User',
    userEmail: user.email || '',
    tenantId: user.tenantId,
    action: 'created',
    resource: 'document',
    resourceId: document._id.toString(),
    details: document.title,
    status: 'success',
  });

  return NextResponse.json({ document }, { status: 201 });
}
