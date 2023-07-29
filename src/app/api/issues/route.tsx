import { NextResponse, NextRequest } from 'next/server'
import getMultipleUsers, { INexusModsUser } from '@/util/NexusMods/multiuserquery';
import { getIssueList, IGitHubIssueResponse, IGitHubIssueList } from '@/util/GitHub/issues-list';
import { ErrorWithHTTPCode } from '@/util/errors';

export async function GET(request: NextRequest) {
    const params = new URL(request.url).searchParams;

    const query = params.get('query')

    let issueList: IGitHubIssueResponse;
    
    try {
        issueList = await getIssueList(query);
    }
    catch(err) {
        const httpErr = err as ErrorWithHTTPCode;
        console.log('Error Object', { code: httpErr.code, status: httpErr.message })
        return NextResponse.json({}, { status: httpErr.code, statusText: httpErr.message })
    }
    
    // Get the list of issues
    const issues: IGitHubIssueList[] = issueList.data?.repository?.issues?.nodes ?? [];

    // Get the Nexus Mods account IDs for the various issues
    const nexusModsIDs = new Set<number>()

    for (const i of issues) {
        const nexusModsData = (i.body as string).match(/<!-- ?NexusMods:([0-9]+).+-->/);
        if (nexusModsData) {
            const [ comment, idString, name ] = nexusModsData
            const memberId: number = parseInt(idString.trim())
            i.NexusMods = { memberId, name };
            nexusModsIDs.add(memberId);
        }
    }

    try {
        const nexusModsUsers: {[key: string] : INexusModsUser}  = await getMultipleUsers(nexusModsIDs);
        for (const issue of issues) {
            if (!issue.NexusMods?.memberId) continue;
            const nexusModsUser = nexusModsUsers[`user_${issue.NexusMods.memberId}`]
            if (!nexusModsUser) {
                issue.NexusMods = undefined;
                continue;
            };
            issue.NexusMods.memberId = nexusModsUser.memberId
            issue.NexusMods.avatar = nexusModsUser.avatar
            issue.NexusMods.name = nexusModsUser.name
        }
    }
    catch(err) {
        console.log('Failed to get Nexus Mods user data', err);
    }

    return NextResponse.json({issues, totalCount: issueList.data?.repository.issues.totalCount});
}

export async function addNexusModsToIssueList(issues: IGitHubIssueList[]): Promise<IGitHubIssueList[]> {
    // Get the Nexus Mods account IDs for the various issues
    const nexusModsIDs = new Set<number>()

    for (const i of issues) {
        const nexusModsData = (i.body as string).match(/<!-- ?NexusMods:([0-9]+).+-->/);
        if (nexusModsData) {
            const [ comment, idString, name ] = nexusModsData
            const memberId: number = parseInt(idString.trim())
            i.NexusMods = { memberId, name };
            nexusModsIDs.add(memberId);
        }
    }

    try {
        const nexusModsUsers: {[key: string] : INexusModsUser}  = await getMultipleUsers(nexusModsIDs);
        for (const issue of issues) {
            if (!issue.NexusMods?.memberId) continue;
            const nexusModsUser = nexusModsUsers[`user_${issue.NexusMods.memberId}`]
            if (!nexusModsUser) {
                issue.NexusMods = undefined;
                continue;
            };
            issue.NexusMods.memberId = nexusModsUser.memberId
            issue.NexusMods.avatar = nexusModsUser.avatar
            issue.NexusMods.name = nexusModsUser.name
        }
        return issues;
    }
    catch(err) {
        console.log('Failed to get Nexus Mods user data', err);
        return issues;
    }
}