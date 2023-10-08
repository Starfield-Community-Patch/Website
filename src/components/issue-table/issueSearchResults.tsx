'use client'

import { FormEvent, Suspense } from "react";
import TableLoadingRow from "./tableskeletonrow";
import IssueRows from "./issueRows";
import useGitHubIssues from "@/hooks/useGitHubIssues";
import IssueSearch from "./issueSearch";
import { ParsedQuery, decodeQueryString, encodeQueryForUrl } from "@/util/GitHub/common";
import { useRouter } from "next/navigation";

interface IProps {
    query: ParsedQuery
}

export default function IssueSearchResults(props: IProps) {
    const { query } = props;
    const { gitHubIssueManager: gh } = useGitHubIssues(query?.base);
    const router = useRouter();

    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableLoadingRow key={idx} />);

    const onSubmit = (newQuery?: string, event?: FormEvent) => {
        if (event) event.preventDefault();
        let merge: ParsedQuery = { ...query, query: newQuery }
        const parsed = decodeQueryString(newQuery);
        if (parsed.labels || parsed.searchIn || parsed.status || parsed.type) {
            merge = { ...query, ...parsed }
        }


        const reEncoded = encodeQueryForUrl(merge);
        router.push(`/issues/search?q=${reEncoded.uri}`)
        gh.setSearchQuery(reEncoded.base)
    }

    console.log('Initial query', query)

    return (
    <div>
    <IssueSearch initialValue={query.query} onSubmit={onSubmit} />
    <table className='table-fixed w-full border-collapse caption-bottom border-spacing-x-2'>
        <thead className=''>
            <tr className=''>
                <th className='w-12'></th>
                <th className='w-auto text-left'> {gh.total} Issue(s)</th>
                <th className='w-24 text-left'>Comments</th>
            </tr>
        </thead>
        <tbody>
            <Suspense fallback={loadingRows()}>
                <IssueRows issues={gh.issues} loader={loadingRows}/>              
            </Suspense>
        </tbody>
    </table>
    </div>
    )
}