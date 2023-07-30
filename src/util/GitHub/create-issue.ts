import { mutation } from 'gql-query-builder';
import { fetchRequest } from "./common";
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

const addIssueQuery = (id: string, title: string, body: string, labels: string[], reference: string) => mutation({
    operation: 'createIssue',
    variables: {
        input: {
            value: { repositoryId: id, title, body, labelIds: labels, clientMutationId: reference },
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

export async function createIssue(repoId: string, title: string, body: string, labels: string[], reference: string): Promise<any> {
    const { GITHUB_TOKEN } = process.env;

    if (!GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = addIssueQuery(repoId, title, body, labels, reference);

    try {
        const req: IGitHubAddIssueResponse = await fetchRequest(GITHUB_TOKEN, query, { revalidate: 0 })
        return req;
    }
    catch(err) {
        const httpErr = (err as ErrorWithHTTPCode)
        throw httpErr;
    }
}