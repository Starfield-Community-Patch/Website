export const gitHubGQL: string = 'https://api.github.com/graphql';
export type IGitHubIssueStates = 'OPEN' | 'CLOSED';
import { ErrorWithHTTPCode } from '../errors';
import { Octokit } from '@octokit/rest';

export const octokit = new Octokit({
    auth: `Bearer ${process.env.GITHUB_TOKEN}`,
    userAgent: 'Starfield-Community-Patch/Website',
});

export interface IGitHubPageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export type GitHubIssueFilter = {
    states?: Set<'OPEN' | 'CLOSED'>;
    labels?: string[];
    after?: string;
    before?: string;
}

export interface GitHubTeam {
    name: string;
    id: number;
    node_id: string;
    slug: string;
    description: string | null;
    privacy?: string,
    notification_setting?: string,
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    permission: string;
    parent: any | null;
}

export async function fetchRequest(TOKEN: string, query: { query: string, variables: any }, options?: NextFetchRequestConfig) {
    const result = await fetch(gitHubGQL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        next: options ?? { revalidate: 0 }
    })
    const resp = (await result.json())
    console.log('Response', JSON.stringify(resp, null, 2))
    if (!result.ok || resp.errors?.length) {
        console.log('Error from GitHub', resp.errors)
        const statusText = `Error from GitHub API: ${!result.ok ? `${result.statusText}\n${resp.message}` : resp.errors?.map((e: any) => e.message).join('\n')}`
        throw new ErrorWithHTTPCode(!result.ok ? result.status : 500, statusText)
    }
    return resp;
}