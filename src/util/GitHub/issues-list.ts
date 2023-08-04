import { query } from 'gql-query-builder';
import { IGitHubIssueStates, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';

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
    comments: {
        totalCount: number;
    }
    updatedAt: Date;
}

const gitHubIssuesQuery = (name: string, owner: string, mentioned: string | null, states?: IGitHubIssueStates[] ) => query({
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
                },
                filterBy: {
                    name: 'filterBy',
                    type: 'IssueFilters',
                    value: { mentioned: mentioned }
                },
                orderBy: {
                    name: 'orderBy',
                    type: 'IssueOrder',
                    value: { field: 'UPDATED_AT', direction: 'DESC' }
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

export async function getIssueList(query: string | null): Promise<IGitHubIssueResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const gitHubQuery = gitHubIssuesQuery(GITHUB_NAME, GITHUB_OWNER, query)

    // console.log(gitHubQuery);

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