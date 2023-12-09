import { NextResponse } from 'next/server';
import { list, ListBlobResultBlob } from '@vercel/blob';

interface BlobWithVersion extends ListBlobResultBlob {
    version?: string;
}

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version');

    const papyrusKey: string | undefined = process.env.PAPYRUS_SECRET;

    if (!papyrusKey) return NextResponse.json({ code: 500, message: "Papyrus Secret is not set, contact the website adminstrator." }, { status: 500 });

    // get the header key
    const userKey: string = request.headers.get('key') ?? '';

    if (userKey !== papyrusKey) return NextResponse.json({ code: 401, message: "Unauthorised." }, { status: 401 });

    // get the latest blob files
    try {
        const blobList = await list({ limit: 5, prefix:'Scripts' });
        let blobs: BlobWithVersion[] = blobList.blobs;
        if (!blobs.length) return NextResponse.json({ message: `No psc files found for version: ${version ?? 'latest'}` }, { status: 404 });
        // Get the blob we want.
        blobs = blobs.map(b => {
            const version = b.pathname.replace('Scripts/', '');
            return {...b, version}
        });

        if (version) {
            const match = blobs.find(b => b.version === version);
            if (!match) return NextResponse.json({ message: `No psc files found for version: ${version}. Available: ${blobs.map(b => (b as any).version).join(', ')}` }, { status: 404 });
            return NextResponse.redirect(match.url);
        }
        else return NextResponse.redirect(blobs[0].url);
    }
    catch(err) {
        return NextResponse.json({ message: `Unexpected error: ${(err as Error).message}` }, { status: 500 });
    }
}