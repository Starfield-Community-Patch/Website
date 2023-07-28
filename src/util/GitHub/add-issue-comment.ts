import { mutation } from 'gql-query-builder';
import { fetchRequest } from "./common";
import { ErrorWithHTTPCode } from '../errors';

interface IGitHubAddCommentResponse {
    data: {
        addComment: {
            clientMutationId: string;
            subject: {
                id: string;
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

const addCommentQuery = (id: string, body: string, reference: string) => mutation({
    operation: 'addComment',
    variables: {
        input: {
            value: { subjectId: id, body, clientMutationId: reference },
            type: 'AddCommentInput',
            required: 'true'
        },
    },
    fields: [
        'clientMutationId',
        {
            subject: ['id']
        }
    ]

}, undefined, { operationName: 'addIssueComment' });

export async function addIssueComment(commentId: string, body: string, reference: string): Promise<any> {
    const { GITHUB_TOKEN } = process.env;

    if (!GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    const query = addCommentQuery(commentId, body, reference);

    try {
        const req: IGitHubAddCommentResponse = await fetchRequest(GITHUB_TOKEN, query, { revalidate: 0 })
        return req;
    }
    catch(err) {
        const httpErr = (err as ErrorWithHTTPCode)
        throw httpErr;
    }
}