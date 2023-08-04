import { IGitHubPageInfo } from "@/util/GitHub/common";
import { IGitHubIssueList, IGitHubIssueResponse } from "@/util/GitHub/issues-list";
import { ErrorWithHTTPCode } from "@/util/errors";
import { useState } from "react";
import useSWR from "swr";

const fetchIssues = async (url: string, sort: GitHubIssueSort, filters?: any): Promise<{ issues: IGitHubIssueList[], pageInfo: IGitHubPageInfo | undefined, total: number }> => {    
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

type GitHubIssueSort = {
    field: 'CREATED_AT' | 'UPDATED_AT' | 'COMMENTS',
    direction: 'ASC' | 'DESC'
}

type GitHubIssueFilter = {
    states?: Set<'OPEN' | 'CLOSED'>;
    labels?: string[];
    mentioned?: string;
}

export default function useGitHubIssues() {

    const [filters, setFilters] = useState<GitHubIssueFilter>({});
    const [sort, setSort] = useState<GitHubIssueSort>({ field: 'UPDATED_AT', direction: 'DESC' }
    );

    const { data: { issues, total, pageInfo }, mutate } = useSWR(
        '/api/issues',
        (url) => fetchIssues(url, sort, filters),
        { fallbackData: { issues: [], total: 0, pageInfo: undefined } }
    );

    const updateSort = async (newSort: GitHubIssueSort) => {
        setSort(newSort);
        await mutate();
    }

    const updateFilters = async (newFilter: GitHubIssueFilter) => {
        setFilters(newFilter);
        await mutate();
    }
    

    return { sort, updateSort, filters, updateFilters, issues, pageInfo, total }
}