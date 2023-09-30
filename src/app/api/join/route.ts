import { inviteTeamMember } from '@/util/GitHub/invite-member';
import { ErrorWithHTTPCode } from '@/util/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const org = req.nextUrl.searchParams.get('org');
    if (!org) return NextResponse.json({}, { status: 422, statusText: 'No `org` query parameter.' })

    const formData = await req.formData()

    const email = formData.get('email');
    if (!email) return NextResponse.json({}, { status: 422, statusText: 'No `email` form data.' })
    if (typeof email !== 'string') return NextResponse.json({}, { status: 422, statusText: 'The email you have submitted is invalid.' })
    // If we were to validate the email ourselves, we'd undoubtedly have a different implementation than GitHub.

    const teamsRaw = formData.getAll('teams[]');
    if (!teamsRaw || teamsRaw.length === 0) return NextResponse.json({}, { status: 422, statusText: 'No `teams[]` form data.' })

    const team_ids = teamsRaw.filter(t => t !== 'unselected').map(t => parseInt(t.toString()));
    if (!team_ids.every(t => !isNaN(t))) return NextResponse.json({}, { status: 422, statusText: 'Invalid `teams[]` form data.' })

    const res = await inviteTeamMember({
        email,
        team_ids,
        org,
        role: 'direct_member'
    }).catch(e => e as ErrorWithHTTPCode);

    //if (!res) return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error - GitHub API Error' })

    if (res instanceof ErrorWithHTTPCode) {
        console.error(res)
        return NextResponse.json(('response' in res && res.response) ?? {}, { status: res.code, statusText: 'response' in res && res.response && typeof res.response === 'object' && 'data' in res.response && res.response.data && typeof res.response.data === 'object' && 'message' in res.response.data && typeof res.response.data.message === 'string' ? res.response.data.message : 'Internal Server Error - Unspecified GitHub API Error' })
    }

    return NextResponse.json(res, { status: res.status, statusText: 'response' in res && res.response && typeof res.response === 'object' && 'data' in res.response && res.response.data && typeof res.response.data === 'object' && 'message' in res.response.data && typeof res.response.data.message === 'string' ? res.response.data.message : 'Internal Server Error - Unspecified GitHub API Error' })
}