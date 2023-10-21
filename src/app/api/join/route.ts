import { inviteTeamMember } from '@/util/GitHub/invite-member';
import { ErrorWithHTTPCode } from '@/util/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const org = req.nextUrl.searchParams.get('org');
    if (!org) return NextResponse.json({statusText: 'No `org` query parameter.'}, { status: 422 })

    const formData = await req.formData()

    const email = formData.get('email');
    if (!email) return NextResponse.json({statusText: 'No `email` form data.'}, { status: 422})
    if (typeof email !== 'string') return NextResponse.json({statusText: 'The email you have submitted is invalid.'}, { status: 422 })
    // If we were to validate the email ourselves, we'd undoubtedly have a different implementation than GitHub.

    const teamsRaw = formData.getAll('teams[]');
    if (!teamsRaw || teamsRaw.length === 0) return NextResponse.json({statusText: 'No `teams[]` form data.'}, { status: 422 })

    const team_ids = teamsRaw.filter(t => t !== 'unselected').map(t => parseInt(t.toString()));
    if (!team_ids.every(t => !isNaN(t))) return NextResponse.json({statusText: 'Invalid `teams[]` form data.'}, { status: 422 })

    const res = await inviteTeamMember({
        email,
        team_ids,
        org,
        role: 'direct_member'
    }).catch(e => { if (e instanceof ErrorWithHTTPCode) return e; else throw e });

    const statusText = 'response' in res && res.response && typeof res.response === 'object' && 'data' in res.response && res.response.data && typeof res.response.data === 'object' && 'message' in res.response.data && typeof res.response.data.message === 'string' ? res.response.data.message : 'Internal Server Error - Unspecified GitHub API Error'

    if (res instanceof ErrorWithHTTPCode) {
        console.error(res)
        return NextResponse.json({res: ('response' in res && res.response) || {}, statusText}, { status: res.code })
    }

    return NextResponse.json({res, statusText}, { status: res.status })
}