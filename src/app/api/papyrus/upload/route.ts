import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const version = searchParams.get('version');


  if (!filename || !version || !request.body) return NextResponse.json({}, { status: 422, statusText: 'Bad Request - Invalid File' })

  if (!filename.toLowerCase().endsWith('.7z')) return NextResponse.json({ message: "7z files only" }, { status: 422, statusText: "7z files only" });

  const blob = await put(`Scripts\\${version}.7z`, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}