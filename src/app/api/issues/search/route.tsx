import { IGitHubIssueSearchResponse, searchIssues } from "@/util/GitHub/issues-search";
import getMultipleUsers, { INexusModsUser } from "@/util/NexusMods/multiuserquery";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {

    const body: { query: string | undefined } = await req.json();

    
    let results: IGitHubIssueSearchResponse | undefined;

    try {
        results = await searchIssues(body.query)
    }
    catch(err) {
        return NextResponse.json(undefined, { status: 500, statusText: (err as Error).message });
    }

    const nexusModsIDs = new Set<number>()
    
    for (const issue of results?.data?.search.edges ?? []) {
        const nexusModsData = (issue.node.body as string).match(/<!-- ?NexusMods:([0-9]+).+-->/);
        if (nexusModsData) {
            const [ comment, idString, name ] = nexusModsData
            const memberId: number = parseInt(idString.trim())
            issue.node.NexusMods = { memberId, name };
            nexusModsIDs.add(memberId);
        }
    }

    try {
        const nexusModsUsers: {[key: string] : INexusModsUser}  = await getMultipleUsers(nexusModsIDs);
        console.log('Got Nexus Mods data', nexusModsUsers)
        for (const issue of results?.data?.search.edges ?? []) {
            if (!issue.node.NexusMods?.memberId) continue;
            const nexusModsUser = nexusModsUsers[`user_${issue.node.NexusMods.memberId}`]
            if (!nexusModsUser) {
                issue.node.NexusMods = undefined;
                continue;
            };
            issue.node.NexusMods.memberId = nexusModsUser.memberId
            issue.node.NexusMods.avatar = nexusModsUser.avatar
            issue.node.NexusMods.name = nexusModsUser.name
        }
    }
    catch(err) {
        console.log('Failed to get Nexus Mods user data', err);
    }


    return NextResponse.json(results);
}

export async function GET(req: NextRequest) {
    // console.log('Searching!')
    
    try {
        const req = await searchIssues('');
        // console.log('Search request', req)
        return NextResponse.json(req);
    }
    catch(err) {
        console.error('Issue search error', err);
        return NextResponse.json(undefined, { status: 500, statusText: (err as Error).message });
    }
}