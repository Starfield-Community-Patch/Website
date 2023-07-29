import { query } from 'gql-query-builder';
import { IGitHubPageInfo, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';

export interface IGitHubRepoResponse {
    data?: {
        repository: IGitHubRepoDetail
    }
    errors?: {
        message: string;
        locations: string[];
        path: string[];
        extensions: any;
    }[] 
    message?: string;
}

export interface IGitHubRepoDetail {
    id: string;
    nameWithOwner: string;
    labels: {
        pageInfo: IGitHubPageInfo;
        nodes: IGitHubLabel[]
        totalCount: number;
    }
}

export interface IGitHubLabel {
    id: string;
    name: string;
    color: string;
    description: string;
}

const repoQuery = (name: string, owner: string) => query({
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
        'id',
        'nameWithOwner',
        {
            operation: 'labels',
            variables: { first: { name: 'first', type: 'Int', value: 25 } },
            fields: [ 
                {
                    pageInfo: ['hasNextPage', 'hasPreviousPage', 'startCursor', 'endCursor']
                },
                {
                    nodes: ['id', 'name', 'color', 'description']
                },
                'totalCount'
            ]

        }
    ]
})

export async function getRepoAndLabels(): Promise<IGitHubRepoResponse> {
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_NAME } = process.env;

    if (!GITHUB_NAME || !GITHUB_OWNER || !GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = repoQuery(GITHUB_NAME, GITHUB_OWNER);

    // console.log('repoandlabel query', query)

    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        next: { revalidate: 60 }
    })
    const resp: IGitHubRepoResponse = await result.json()
    if (!result.ok || resp.errors?.length) {
        console.log('Error issue from GitHub', resp.errors)
        const statusText = `Could not get GitHub repo info: ${!result.ok ? `${result.statusText}\n${resp.message}` : resp.errors?.map(e => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }

    return resp;
}