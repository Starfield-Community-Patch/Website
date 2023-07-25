import { query } from 'gql-query-builder';
import { ErrorWithHTTPCode } from '../errors';
import getMultipleUsers, { INexusModsUser } from '../NexusMods/multiuserquery';
const gitHubGQL: string = 'https://api.github.com/graphql';

type IGitHubIssueStates = 'OPEN' | 'CLOSED';

export interface IGitHubIssueResponse {
    data?: {
        repository: {
            issues: {
                totalCount: number;
                nodes: IGitHubIssueList[]
            }
            nameWithOwner: string;
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

export interface IGitHubSingleIssueResponse {
    data?: {
        repository: {
            issue: IGitHubIssueDetail
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
        pageInfo: IGitHubCommentPageInfo;
        nodes: IGitHubComment[]
    }
}

export interface IGitHubCommentPageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
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

export interface IGitHubIssueDetail {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    number: number;
    state: IGitHubIssueStates;
    updatedAt: string;
    url: string;
    author: {
        login: string;
        avatarUrl: string;
    }
    NexusMods?: INexusModsUser
    comments: {
        totalCount: number;
    }
}

export interface IGitHubIssueList {
    id: string;
    number: number;
    title: string;
    body: string;
    author: {
        login: string;
        avatarUrl: string;
    }
    NexusMods?: {
        name: string;
        memberId: number;
        avatar?: string;
    }
    comments: number;
    updatedAt: Date;
}

const gitHubIssuesQuery = (name: string, owner: string, states?: IGitHubIssueStates[] ) => query({
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
            operation: 'issues',
            variables: {
                first: {
                    name: 'first',
                    type: 'Int',
                    required: true,
                    value: 20
                },
                after: {
                    name: 'after',
                    type: 'String',
                    value: undefined
                },
                states: {
                    name: 'states',
                    type: 'IssueState!',
                    value: states ?? 'OPEN',
                    list: true
                }
            },
            fields: [
                'totalCount',
                {
                    nodes: [ 
                        'id', 
                        'number', 
                        'title', 
                        'body',
                        'updatedAt',
                        {
                            comments: ['totalCount']
                        },
                        {
                            author: ['login', 'avatarUrl']
                        }
                    ]
                }
            ]
        }, 
        'nameWithOwner'
    ]
});

const singleIssueQuery = (id: number, name: string, owner: string) => query({
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
                'id',
                'body', 
                'createdAt', 
                'number', 
                'state', 
                'title', 
                'updatedAt', 
                'url',  
                {
                    author: ['login', 'avatarUrl']
                },
                {
                    operation: 'comments',
                    variables: {
                        first: {
                            name: 'first',
                            type: 'Int',
                            value: 10
                        }
                    },
                    fields: [ 'totalCount' ]
                }
            ]

        }
    ]
})

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
        const matches = comment.body.match(/<!-- ?NexusMods:([0-9]+):([0-9a-zA-Z]+) ?-->/)
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
    }
    
    return resp;
}


export async function getSingleIssue(id: number): Promise<IGitHubSingleIssueResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = singleIssueQuery(id, GITHUB_NAME, GITHUB_OWNER);

    // console.log(query)

    if (typeof(id) !== 'number' || isNaN(id)) throw new ErrorWithHTTPCode(400, 'Invalid Issue ID: '+id)

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 10 }
    })
    const resp: IGitHubSingleIssueResponse = await result.json()
    if (!result.ok || resp.errors?.length) {
        console.log('Error issue from GitHub', resp.errors)
        const statusText = `Could not get GitHub issues: ${!result.ok ? `${result.statusText}\n${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }

    // Check for Nexus Mods data
    const nexusModsData = resp.data?.repository.issue.body.match(/<!-- ?NexusMods:([0-9]+):([0-9a-zA-Z]+) ?-->/);
    if (nexusModsData) {
        const [ comment, idString, name ] = nexusModsData
        const id: number = parseInt(idString.trim())
        try {
            const nxmData = await getMultipleUsers(new Set([id]));
            resp.data!.repository.issue.NexusMods = nxmData[`user_${id}`] ?? undefined;
        }
        catch(err) {
            console.log('Could not get Nexus Mods account data for issue', err);
        }
    }
    return resp;
}

export async function getIssueList(): Promise<IGitHubIssueResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const gitHubQuery = gitHubIssuesQuery(GITHUB_NAME, GITHUB_OWNER)

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(gitHubQuery),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 0 }
    });
    const resp: IGitHubIssueResponse = await result.json()
    if (!result.ok || resp.errors?.length) {
        console.log('Error getting issues from GitHub', resp)
        const statusText = `${!result.ok ? `${result.statusText} - ${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }
    return resp;
}