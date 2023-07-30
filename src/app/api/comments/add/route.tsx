import { NextResponse, NextRequest } from 'next/server'
import { ErrorWithHTTPCode } from '@/util/errors';
import { addIssueComment } from '@/util/GitHub/add-issue-comment';
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt"
import OAuthProviders from '@/util/auth/oauth';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {

    const params = new URL(request.url).searchParams;
    const body = await request.formData()
    let comment: string = body.get('comment') as string;

    const id: string | null = params.get('issue_id');
    const number: number | null = parseInt(params.get('issue_number') ?? '-1');

    if (!id) return NextResponse.json({}, { status: 400, statusText: 'Bad Request - Invalid Comment ID' })
    if (!comment || comment === '') return NextResponse.json({}, { status: 422, statusText: 'Bad Request - Invalid Comment Body' })

    // if (process.env.NODE_ENV === 'production') return NextResponse.json({}, { status: 403, statusText: 'This feature is currently unavailable.' })

    // Check OAuth Credentials 
    const session = await getServerSession(OAuthProviders);
    if (!session) return NextResponse.json({}, { status: 403, statusText: 'Forbidden - You must be logged in to Nexus Mods' })
    // console.log('Create comment session', session);

    const jwt = await getToken({ req: request });
    // console.log('Create comment JWT', jwt);

    // Append the comment with the Nexus Mods ID
    comment = `${comment}\n\n<!-- NexusMods:${329875} -->`;


    // Submit the comment to GitHub    
    try {
        const reference = (Math.random() + 1).toString(36).substring(7);
        const sendComment = await addIssueComment(id, comment, reference);
        if (!isNaN(number)) revalidateTag(`${number}_comments`)
        return NextResponse.json(sendComment)
    }
    catch(err) {
        console.log('Error', err)
        const httpErr = err as ErrorWithHTTPCode;
        return NextResponse.json({}, { status: httpErr.code, statusText: httpErr.message })
    }
}