import { NextResponse } from 'next/server';
import { list, ListBlobResultBlob } from '@vercel/blob';

interface BlobWithVersion extends ListBlobResultBlob {
    version?: string;
}

export async function GET(request: Request): Promise<NextResponse> {

    if (process.env.NODE_ENV === 'production') return NextResponse.json({}, { status: 404 });

    const papyrusKey: string | undefined = process.env.PAPYRUS_SECRET;

    if (!papyrusKey) return NextResponse.json({ code: 500, message: "Papyrus Secret is not set, contact the website adminstrator." }, { status: 500 });

    // get the latest blob files
    try {
        const blobList = await list({ limit: 5, prefix:'Scripts' });
        let blobs: BlobWithVersion[] = blobList.blobs;
        if (!blobs.length) return NextResponse.json({ message: `No psc files found.` }, { status: 404 });
        // Get the blob we want.
        return NextResponse.json(blobs);
    }
    catch(err) {
        return NextResponse.json({ message: `Unexpected error: ${(err as Error).message}` }, { status: 500 });
    }
}