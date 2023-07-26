import { NextResponse, NextRequest } from 'next/server'
import { getSingleIssue, IGitHubSingleIssueResponse } from '@/util/GitHub/issue';
import { ErrorWithHTTPCode } from '@/util/errors';

export async function GET(request: NextRequest) {

    const params = new URL(request.url).searchParams;

    const id: number = parseInt(params.get('id') || '');

    if (isNaN(id)) return NextResponse.json({}, { status: 400, statusText: 'Bad Request' })


    console.log('Params', params, id);

    let issue: IGitHubSingleIssueResponse;
    
    try {
        issue = await getSingleIssue(id);
    }
    catch(err) {
        console.log('Error', err)
        const httpErr = err as ErrorWithHTTPCode;
        return NextResponse.json({}, { status: httpErr.code, statusText: httpErr.message })
    }



    return NextResponse.json({issue})
    
    // // Get the list of issues
    // const issues: IGitHubIssueList[] = issueList.data?.repository?.issues?.nodes ?? [];

    // // Get the Nexus Mods account IDs for the various issues
    // const nexusModsIDs = new Set<number>()

    // for (const i of issues) {
    //     const nexusModsData = (i.body as string).match(/<!-- ?NexusMods:([0-9]+):([0-9a-zA-Z]+) ?-->/);
    //     if (nexusModsData) {
    //         const [ comment, idString, name ] = nexusModsData
    //         const id: number = parseInt(idString.trim())
    //         i.NexusMods = { id, name };
    //         nexusModsIDs.add(id);
    //     }
    // }

    // try {
    //     const nexusModsUsers: {[key: string] : INexusModsUser}  = await getMultipleUsers(nexusModsIDs);
    //     for (const issue of issues) {
    //         if (!issue.NexusMods?.id) continue;
    //         const nexusModsUser = nexusModsUsers[`user_${issue.NexusMods.id}`]
    //         if (!nexusModsUser) {
    //             issue.NexusMods = undefined;
    //             continue;
    //         };
    //         issue.NexusMods.id = nexusModsUser.memberId
    //         issue.NexusMods.avatar = nexusModsUser.avatar
    //         issue.NexusMods.name = nexusModsUser.name
    //     }
    // }
    // catch(err) {
    //     console.log('Failed to get Nexus Mods user data', err);
    // }

    // return NextResponse.json({issues, totalCount: issueList.data?.repository.issues.totalCount});
}