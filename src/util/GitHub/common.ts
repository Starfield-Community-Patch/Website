export const gitHubGQL: string = 'https://api.github.com/graphql';
export type IGitHubIssueStates = 'OPEN' | 'CLOSED';
import { ErrorWithHTTPCode } from '../errors';

export async function fetchRequest(TOKEN: string, query: { query: string, variables: string }) {
    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        next: { revalidate: 0 }
    })
    const resp = (await result.json())
    // console.log('Response', resp)
    if (!result.ok || resp.errors?.length) {
        console.log('Error from GitHub', resp.errors)
        const statusText = `Could not get GitHub issues: ${!result.ok ? `${result.statusText}\n${resp.message}` : resp.errors?.map((e: any) => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }
    return resp;
}