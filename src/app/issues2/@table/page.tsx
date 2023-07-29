'use client'
import IssueRows from "@/components/issue-table/issueRows";
import TableSkeletonRow from "@/components/tableskeletonrow";
import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import { Suspense, useState } from "react";

export default function IssuesTable() {
    const [issues, setIssues] = useState<IGitHubIssueList[]>([]);
    const [query, setQuery] = useState<string | undefined>(undefined);

    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableSkeletonRow key={idx} />)

    return (
        <div>
            <div className="w-full flex flex-row justify-around">
                <div>
                    All Issues {issues.length}
                </div>
                <div>
                    My Issues
                </div>
            </div>
            <div className="w-full text-center">
                <div>
                    <input type="text" className="w-10/12 border-2 border-black" onChange={(e) => setQuery(e.target.value)} />
                    Search
                </div>
            </div>
            <table className='table-fixed w-full'>
                <thead className=''>
                    <tr className=''>
                        <th className='lg:w-1/2'>Issue</th>
                        <th className='lg:w-3/8'>Reporter</th>
                        <th className='lg:w-1/8 w-3/12'>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    <Suspense fallback={loadingRows()}>
                        <IssueRows setIssues={setIssues} query={query} />                    
                    </Suspense>
                </tbody>
            </table>
        </div>
    )
}