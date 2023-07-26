import { query } from 'gql-query-builder';
import { IGitHubIssueStates, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';
import getMultipleUsers, { INexusModsUser } from '../NexusMods/multiuserquery';

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