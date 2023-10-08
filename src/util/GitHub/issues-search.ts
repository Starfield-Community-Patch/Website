import { query } from 'gql-query-builder';
import { GitHubIssueFilter, IGitHubPageInfo, gitHubGQL, octokit } from "./common";
import { ErrorWithHTTPCode } from '../errors';
import { IGitHubIssueList } from './issues-list';

export interface IGitHubIssueSearchResponse {
    data?: {
        search: {
            issueCount: number;
            pageInfo: IGitHubPageInfo;
            edges: {
                node: IGitHubIssueList
            }[]
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

const gitHubSearchIssuesQuery = (q: string, filters?: GitHubIssueFilter ) => query({
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
        first: 10,
        after: filters?.after,
        before: filters?.before
    },
    fields: [
        'issueCount',
        {
            pageInfo: ['hasNextPage', 'hasPreviousPage', 'endCursor', 'startCursor']
        },
        {
            edges: [
                {
                    node: [
                        {
                            operation: 'Issue',
                            fields: [
                                'id',
                                'number',
                                'state',
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
                                    operation: 'labels',
                                    variables: {
                                        first: 10
                                    },
                                    fields: [
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
    ]
});

export async function searchIssues(searchTerms: string|undefined, filter?: GitHubIssueFilter, sort?: any): Promise<IGitHubIssueSearchResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    // NEED TO BUILD THIS UP TO SEND!
    let queryString = `repo:${GITHUB_OWNER}/${GITHUB_NAME} is:issue ${searchTerms}`;
    // Apply filter for open or closed issues
    if (filter?.states?.size === 1) {
        queryString += filter.states.has('OPEN') ? ' is:open' : ' is:closed'
    }
    // Apply label filter
    if (filter?.labels?.length) {
        queryString += filter.labels.map(l => l.indexOf(' ') !== -1 ? `label:"${l}"` : `label:${l}`).join(' ');
    }
    // console.log('Search issue terms', {searchTerms, queryString})

    const gitHubQuery = gitHubSearchIssuesQuery(queryString, filter)

    // console.log('Issue Search', gitHubQuery);

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(gitHubQuery),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 1 }
    });
    const resp: IGitHubIssueSearchResponse = await result.json()
    if (!result.ok || resp.errors?.length) {
        console.log('Error getting issues from GitHub', resp)
        const statusText = `${!result.ok ? `${result.statusText} - ${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }
    return resp;
}