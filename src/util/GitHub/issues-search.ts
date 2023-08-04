import { query } from 'gql-query-builder';
import { IGitHubIssueStates, IGitHubPageInfo, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';
import { IGitHubLabel } from './get-repo-labels';

export interface IGitHubIssueSearchResponse {
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
    labels: {
        nodes: IGitHubLabel[]
    }
}

const gitHubIssuesQuery = (q: string ) => query({
    operation: 'search',
    variables: {
        query: {
            name: 'query',
            type: 'String',
            required: true,
            value: q
        },
        type: {
            name: 'type',
            type: 'SearchType',
            required: true,
            value: 'ISSUE'
        },
        first: 10
    },
    fields: [
        'issueCount',
        {
            operation: 'edges',
            fields: [
                'totalCount',
                {
                    operation: 'node',
                    fields: [
                        {
                            operation: 'Issue',
                            fields: [
                                'id',
                                'number',
                                'title',
                                'body',
                                {
                                    author: ['login', 'avatarUrl']
                                },
                                {
                                    comments: ['totalCount']
                                },
                                'updatedAt',
                                {
                                    labels: [
                                        {
                                            nodes: [
                                                'id',
                                                'name',
                                                'color',
                                                'description'
                                            ]
                                        }
                                    ]
                                }
                            ],
                            fragment: true
                        }
                    ]
                },
            ]
        }, 
        'nameWithOwner'
    ]
});

export async function getIssueList(): Promise<IGitHubIssueSearchResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    // NEED TO BUILD THIS UP TO SEND!
    const queryString = `repo:${GITHUB_OWNER}/${GITHUB_NAME} is:issue is:open NexusMods:31179975 in:body`;

    const gitHubQuery = gitHubIssuesQuery(queryString)

    console.log('Issue Search', gitHubQuery);

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(gitHubQuery),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 0 }
    });
    const resp: IGitHubIssueSearchResponse = await result.json()
    if (!result.ok || resp.errors?.length) {
        console.log('Error getting issues from GitHub', resp)
        const statusText = `${!result.ok ? `${result.statusText} - ${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }
    return resp;
}