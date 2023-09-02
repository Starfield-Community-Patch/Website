import { query } from 'gql-query-builder';
import { GitHubIssueFilter, IGitHubPageInfo, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';
import { IGitHubLabel } from './get-repo-labels';

export interface IGitHubIssueResponse {
    data?: {
        repository: {
            issues: {
                totalCount: number;
                pageInfo: IGitHubPageInfo;
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
    state: 'OPEN' | 'CLOSED';
    title: string;
    body: string;
    author: {
        login: string;
        avatarUrl: string;
    }
    NexusMods?: {
        name?: string;
        memberId: number;
        avatar?: string;
    }
    comments: {
        totalCount: number;
    }
    updatedAt: Date;
    labels: {
        nodes: IGitHubLabel[]
    }
}

const gitHubIssuesQuery = (name: string, owner: string, filters?: GitHubIssueFilter ) => query({
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
                    value: 10
                },
                after: {
                    name: 'after',
                    type: 'String',
                    value: filters?.after
                },
                before: {
                    name: 'before',
                    type: 'String',
                    value: filters?.before
                },
                states: {
                    name: 'states',
                    type: 'IssueState!',
                    value: filters?.states ? [...filters?.states] : 'OPEN',
                    list: true
                },
                filterBy: {
                    name: 'filterBy',
                    type: 'IssueFilters',
                    value: { labels: filters?.labels }
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
                        'number', 
                        'state',
                        'title', 
                        'body',
                        'updatedAt',
                        {
                            comments: ['totalCount']
                        },
                        {
                            author: ['login', 'avatarUrl']
                        },
                        {
                            operation: 'labels',
                            variables: {
                                firstLabels: {
                                    name: 'first',
                                    type: 'Int',
                                    value: 10
                                }
                            },
                            fields: [
                                { nodes: ['id', 'name', 'color', 'description'] }
                            ]
                        }
                    ]
                }
            ]
        }, 
        'nameWithOwner'
    ]
});



export async function getIssueList(filters?: GitHubIssueFilter): Promise<IGitHubIssueResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const gitHubQuery = gitHubIssuesQuery(GITHUB_NAME, GITHUB_OWNER, filters)

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