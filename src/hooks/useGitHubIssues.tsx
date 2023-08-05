import { GitHubIssueFilter, IGitHubPageInfo } from "@/util/GitHub/common";
import { IGitHubIssueList, IGitHubIssueResponse } from "@/util/GitHub/issues-list";
import { IGitHubIssueSearchResponse } from "@/util/GitHub/issues-search";
import { ErrorWithHTTPCode } from "@/util/errors";
import { useEffect, useState } from "react";

const fetchIssues = async (url: string, sort: GitHubIssueSort, filters?: GitHubIssueFilter): Promise<{ issues: IGitHubIssueList[], pageInfo: IGitHubPageInfo | undefined, total: number }> => {    
    try {
        const req = await fetch(
            url, 
            { 
                method: 'POST', 
                body: JSON.stringify({ sort, filters }),
                next: { revalidate: 1 } 
            }
        );
        if (!req.ok) {
            console.error('Failed to fetch issues', { status: req.status, message: req.statusText })
            throw new ErrorWithHTTPCode(req.status, req.statusText);
        };
        const res: IGitHubIssueResponse = await req.json();
        return {
            issues: res.data?.repository.issues.nodes ?? [],
            pageInfo: res.data?.repository.issues.pageInfo,
            total: res.data?.repository.issues.totalCount ?? 0
        }
    }
    catch(err) {
        console.error('Unexpected error!', err);
    }
    
    return { issues: [], pageInfo: undefined, total: 0 }
}

const fetchSearch = async (url: string, query?: string, filters?: GitHubIssueFilter): Promise<{ issues: IGitHubIssueList[], total: number, pageInfo: IGitHubPageInfo | undefined }> => {
    // Not actually doing a search
    if (!query) return { issues: [], total: 0, pageInfo: undefined };
    try {
        const req = await fetch(
            url, 
            { 
                method: 'POST', 
                body: JSON.stringify({ query, filters }),
                next: { revalidate: 1 } 
            }
        );
        if (!req.ok) {
            console.error('Failed to fetch issues', { status: req.status, message: req.statusText })
            throw new ErrorWithHTTPCode(req.status, req.statusText);
        };
        const res: IGitHubIssueSearchResponse = await req.json();
        return {
            issues: res.data?.search.edges.map(e => e.node) ?? [],
            total: res.data?.search.issueCount ?? 0,
            pageInfo: res.data?.search.pageInfo
        }
        
    }
    catch(err) {
        console.error('Issue Search Error', err);
    }
    
    return { issues: [], total: 0, pageInfo: undefined };
}

type GitHubIssueSort = {
    field: 'CREATED_AT' | 'UPDATED_AT' | 'COMMENTS',
    direction: 'ASC' | 'DESC'
}

export default function useGitHubIssues(initialSearch?: string) {
    const [filters, setFilters] = useState<GitHubIssueFilter>({});
    const [sort, setSort] = useState<GitHubIssueSort>({ field: 'UPDATED_AT', direction: 'DESC' });
    const [searchQuery, setSearchQuery] = useState<string | undefined>(initialSearch);
    const [issues, setIssues] = useState<IGitHubIssueList[] | undefined>(undefined)
    const [total, setTotal] = useState<number>(0);
    const [pageInfo, setPageInfo] = useState<IGitHubPageInfo>()

    async function getSearchResults(q: string) {
        try {
            const data = await fetchSearch('/api/issues/search', q)
            setIssues(data.issues)
            setPageInfo(data.pageInfo)
            setTotal(data.total)

        }
        catch(err) {
            console.log('Failed to get issues!', err)
            setIssues([])
            setPageInfo(undefined)
            setTotal(0)
        }
    }

    async function getIssues(s: GitHubIssueSort, f: GitHubIssueFilter) {
        try {
            const data = await fetchIssues('/api/issues', s, f)
            setIssues(data.issues)
            setPageInfo(data.pageInfo)
            setTotal(data.total)

        }
        catch(err) {
            console.log('Failed to get issues!', err)
            setIssues([])
            setPageInfo(undefined)
            setTotal(0)
        }
    }

    // Fetch the initial values
    useEffect(() => {
        if (!issues && !searchQuery) getIssues(sort, filters)
        else if (!issues && searchQuery) getSearchResults(searchQuery)
    })

    // Update the table
    useEffect(() => {
        if (searchQuery) getSearchResults(searchQuery)
        else getIssues(sort, filters)
    }, [sort, filters, searchQuery])

    const gitHubIssueManager = {
        sort,
        setSort,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        issues,
        total,
        pageInfo
    }

    return { gitHubIssueManager }
}