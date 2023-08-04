'use client'
import { Suspense, useState } from 'react'
import IssueRows from './issueRows'
import useGitHubIssues from '@/hooks/useGitHubIssues'
import TableLoadingRow from '../tableSkeletonRow2'
import { signIn, useSession } from "next-auth/react"


export default function IssueTable() {
    const { data: session } = useSession();

    const {
        sort, updateSort, filters, 
        updateFilters, issues, pageInfo, total
    } = useGitHubIssues();

    const [tab, setTab] = useState<'all' | 'mine'>('all');

    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableLoadingRow key={idx} />);

    const setMyIssues = () => {
        const mentioned = `NexusMods:${(session as any)?.id}`
        console.log('Mentioned Filter', mentioned, session)
        setTab('mine');
        updateFilters({ mentioned });        
    }

    const setAllIssues = () => {
        const newFilters = { ...filters, mentioned: undefined };
        setTab('all');
        updateFilters(newFilters);
    }

    

    return (
        <div>
            <pre>{JSON.stringify(filters)}</pre>
            <div className='grid grid-cols-2 my-4 border-b-2 select-none border-black w-full text-center'>
                <div className='hover:bg-slate-300 px-4 py-2' onClick={setAllIssues}>All Issues</div>
                <div className='hover:bg-slate-300 cursor-not-allowed px-4 py-2' onClick={setMyIssues} title='Not implemented'>My Issues</div>
            </div>
            <table className='table-fixed w-full border-collapse caption-bottom border-spacing-x-2'>
                <thead className=''>
                    <tr className=''>
                        <th className='w-auto text-left'> {total} Issue(s)</th>
                        <th className='w-24 text-left'>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    <Suspense fallback={loadingRows()}>
                        <IssueRows issues={issues} />              
                    </Suspense>
                </tbody>
            </table>
            <div className='flex flex-row justify-between my-4'>
                <button>Previous</button>
                <button>Next</button>
            </div>
        </div>
    )
}