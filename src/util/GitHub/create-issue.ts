import { mutation } from 'gql-query-builder';
import { fetchRequest, gitHubGQL } from "./common";
import { ErrorWithHTTPCode } from '../errors';

export interface IGitHubAddIssueResponse {
    data: {
        createIssue: {
            clientMutationId: string;
            issue: {
                number: number;
            }
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

const addIssueQuery = (repositoryId: string, title: string, body: string, labelIds: string[], clientMutationId: string) => mutation({
    operation: 'createIssue',
    variables: {
        input: {
            value: { repositoryId, title, body, labelIds, clientMutationId },
            type: 'CreateIssueInput',
            required: 'true'
        },
    },
    fields: [
        'clientMutationId',
        {
            issue: ['number']
        }
    ]

}, undefined, { operationName: 'createNewIssue' });

export async function createIssue(repoId: string, title: string, body: string, labelIds: string[], reference: string): Promise<any> {
    const { GITHUB_TOKEN } = process.env;

    if (!GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = addIssueQuery(repoId, title, body, labelIds.map(l => l.trim()), reference);

    console.log('Create issue', { query: query.query, input: JSON.stringify(query.variables)})

    console.log('Stringified', JSON.stringify(query))

    try {
        // throw new ErrorWithHTTPCode(400, 'Access denied')
        const req: IGitHubAddIssueResponse = await fetchRequest(GITHUB_TOKEN, query, { revalidate: 0 })
        return req;
    }
    catch(err) {
        const httpErr = (err as ErrorWithHTTPCode)
        throw httpErr;
    }
}