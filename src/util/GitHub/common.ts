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

// We only want to support a limited subset of filters for the in-app page.
const queryPrefixes = {is: 'is:', label: 'label:', in: 'in:'};

export interface ParsedQuery {
    base?: string,
    query?: string | undefined;
    type?: 'issue' | 'pr';
    status?: 'OPEN' | 'CLOSED';
    labels?: string[]
    searchIn?: string[]
}

export function decodeQueryString(query?: string): ParsedQuery {
    if (!query) return { };
    const output = query.split(' ');
    let result: ParsedQuery = { base: query };
    // Split the query by spaces and see if we can break down the labels/status etc
    let currentSegment : string = '';
    
    for (const segment of output) {
        if (segment.startsWith(queryPrefixes.is)) {
            const isType = segment.replace(queryPrefixes.is, '');
            // Issue
            if (isType === 'issue') {
                result.type = 'issue';
                currentSegment = '';
                continue;
            }
            // Open/Closed
            if (['open', 'closed'].includes(isType)) {
                result.status = isType === 'open' ? 'OPEN' : 'CLOSED';
                currentSegment = '';
                continue;
            }

        }
        else if (segment.startsWith(queryPrefixes.in)) {
            const inType = segment.replace(queryPrefixes.in, '').split(',').filter(i => ['title', 'body', 'comments'].includes(i));
            result.searchIn = inType;
            currentSegment = '';
            continue;
        }
        else if (segment.startsWith(queryPrefixes.label)) {
            if (!currentSegment.startsWith(queryPrefixes.label)) {
                result.query = currentSegment;
                currentSegment = segment;
            }
            if (!result.labels) result.labels = [];
            const label = segment.replace(queryPrefixes.label, '').trim();
            if (!label.startsWith('"')) result.labels?.push(label)
            continue;
        }
        // Continuing an existing label
        else if (currentSegment.startsWith(queryPrefixes.label)) {
            const noPrefix = currentSegment.replace(queryPrefixes.label, '')
            if (noPrefix.startsWith('"') && segment.trim().endsWith('"')) {
                const label = `${noPrefix.substring(1)} ${segment.substring(0, segment.length -1)}`
                result.labels?.push(label);
            }
            else currentSegment = `${currentSegment} ${segment}`;
        }
        else {
            currentSegment = currentSegment.length ? `${currentSegment} ${segment}` : segment
            result.query = currentSegment.trim();
        };

    }
    return result

}

export function encodeQueryForUrl(query: ParsedQuery): { uri: string, base: string } {
    let result = { uri: '', base: '' };
    if (query.type) {
        result.uri += `is:${query.type}+`;
        result.base += `is:${query.type} `;
    }
    if (query.status) {
        result.base += `is:${query.status.toLowerCase()} `;
        result.uri += `is:${query.status.toLowerCase()}+`
    }
    if (query.query) {
        result.uri += `${query.query.split(' ').map(seg => encodeURI(seg)).join('+')}+`
        result.base += `${query.query} `
    }
    if (query.searchIn) {
        result.uri += `in:${query.searchIn.join(',')}+`;
        result.base += `in:${query.searchIn.join(',')} `
    }
    if (query.labels) {
        result.uri += `${query.labels.map(l => l.indexOf(' ') ? `label%3A"${fixedEncodeURIComponent(l).split('%20').join('+')}"` : `label%3A${l}`).join('+')}`;
        result.base += `${query.labels.map(l => l.indexOf(' ') ? `label:"${l}"` : `label:${l}`).join(' ')}`
    }

    if (result.uri[result.uri.length - 1] === '+') {
        result.uri = result.uri.substring(0, result.uri.length -1)
        result.base = result.base.trim()
    }

    return result;
}

function fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
