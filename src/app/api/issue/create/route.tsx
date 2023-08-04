import { NextRequest, NextResponse } from "next/server";
import { ErrorWithHTTPCode } from '@/util/errors';
import { createIssue } from '@/util/GitHub/create-issue';
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt"
import OAuthProviders from '@/util/auth/oauth';
import { revalidatePath } from 'next/cache';


export async function POST(request: NextRequest) {
    const params = new URL(request.url).searchParams;
    const form = await request.formData()
    let title: string = form.get('title') as string;
    let body: string = form.get('body') as string;
    let labels: string[] = (form.get('labels') as string)?.split(',');

    const id: string | null = params.get('repo_id');

    if (!id) return NextResponse.json({}, { status: 400, statusText: 'Bad Request - Invalid Repository ID' })
    if (!title || title === '' || !body || body === '') 
        return NextResponse.json({}, { status: 422, statusText: 'Bad Request - Invalid Issue Title or Body' })

    // if (process.env.NODE_ENV === 'production') return NextResponse.json({}, { status: 403, statusText: 'This feature is currently unavailable.' })

    // Check OAuth Credentials 
    const session = await getServerSession(OAuthProviders);
    if (!session) return NextResponse.json({}, { status: 403, statusText: 'Forbidden - You must be logged in to Nexus Mods' })

    const jwt = await getToken({ req: request });

    // Append the issue with the Nexus Mods ID
    body = `${body}\n\n<!-- NexusMods:${jwt?.sub} -->`;

     // Submit the comment to GitHub    
     try {
        const reference = (Math.random() + 1).toString(36).substring(7);
        const sendIssue = await createIssue(id, title, body, labels, reference);
        revalidatePath('/api/issues');
        return NextResponse.json(sendIssue)
    }
    catch(err) {
        console.log('Error', err)
        const httpErr = err as ErrorWithHTTPCode;
        return NextResponse.json({}, { status: httpErr.code, statusText: httpErr.message })
    }


}