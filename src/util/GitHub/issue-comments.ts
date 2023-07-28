import { query } from 'gql-query-builder';
import { gitHubGQL, IGitHubPageInfo } from "./common";
import { ErrorWithHTTPCode } from '../errors';
import getMultipleUsers, { INexusModsUser } from '../NexusMods/multiuserquery';

export interface IGitHubCommentsResponse {
    data?: {
        repository: {
            issue: IGitHubIssueComments
        }
    }
    errors?: {
        message: string;
        locations: string[];
        path: string[];
        extensions: any;
    }[] 
    message?: string;
}

export interface IGitHubIssueComments {
    totalCount: number;
    comments: {
        pageInfo: IGitHubPageInfo;
        nodes: IGitHubComment[]
    }
}

export interface IGitHubComment {
    id: string;
    body: string;
    createdAt: string;
    url: string;
    author: {
        login: string;
        avatarUrl: string;
    }
    NexusMods?: INexusModsUser
}

const issueComments = (id: number, name: string, owner: string, after?: string | null, before?: string | null) => query({
    operation: 'repository',
    variables: {
        name: {
            name: 'name',
            type: 'String',
            required: true,
            value: name
        },
        owner: {
            name: 'owner',
            type: 'String',
            required: true,
            value: owner
        }
    },
    fields: [
        {
            operation: 'issue',
            variables: { number: { name: 'number', type: 'Int', required: true, value: id } },
            fields: [ 
                {
                    operation: 'comments',
                    variables: {
                        first: {
                            name: 'last',
                            type: 'Int',
                            value: 10
                        },
                        before: {
                            name: 'before',
                            type: 'String',
                            value: before
                        },
                        after: {
                            name: 'after',
                            type: 'String',
                            value: after
                        }
                    },
                    fields: [ 
                        'totalCount', 
                        {
                            pageInfo: [
                                'startCursor',
                                'endCursor',
                                'hasNextPage',
                                'hasPreviousPage'
                            ]
                        },
                        {
                            nodes: [
                                'id',
                                'body',
                                'createdAt',
                                'url',
                                {
                                    author: [ 'login', 'avatarUrl' ]
                                }
                            ]
                        }
                    ]
                }
            ]

        }
    ]
})

export async function getIssueComments(id: number, after?: string | null, before?: string | null): Promise<IGitHubCommentsResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = issueComments(id, GITHUB_NAME, GITHUB_OWNER, after, before);

    // console.log(query)

    if (typeof(id) !== 'number' || isNaN(id)) throw new ErrorWithHTTPCode(400, 'Invalid Issue ID: '+id)

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 0 }
    })
    const resp: IGitHubCommentsResponse = (await result.json())
    // console.log('Response', resp)
    if (!result.ok || resp.errors?.length) {
        console.log('Error issue from GitHub', resp.errors)
        const statusText = `Could not get GitHub issues: ${!result.ok ? `${result.statusText}\n${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }

    // Check for Nexus Mods data
    let NexusModsIDs = new Set<number>();
    for (const comment of resp.data?.repository?.issue?.comments?.nodes || []) {
        const matches = comment.body.match(/<!-- ?NexusMods:([0-9]+).+-->/)
        if (matches) {
            const [ post, idString, name ] = matches
            const id: number = parseInt(idString.trim())
            comment.NexusMods = { name, memberId: id };
            NexusModsIDs.add(id);
        }

    }

    // Get data for collected IDs
    try {
        const nxmData = NexusModsIDs.size ? await getMultipleUsers(NexusModsIDs) : {};
        if (Object.keys(nxmData).length) {
            for (const comment of resp.data?.repository?.issue?.comments?.nodes || []) {
                if (!comment.NexusMods) continue;
                comment.NexusMods = nxmData[`user_${comment.NexusMods.memberId}`];
            }
        }
    }
    catch(err) {
        console.log('Could not get Nexus Mods account data for comments', err);
        for (const comment of resp.data?.repository?.issue?.comments?.nodes || []) {
            if (comment.NexusMods) comment.NexusMods = undefined;
        }
    }
    
    return resp;
}