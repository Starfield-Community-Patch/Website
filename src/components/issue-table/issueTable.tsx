'use client'
import { Suspense, useState } from 'react'
import IssueRows from './issueRows'
import useGitHubIssues from '@/hooks/useGitHubIssues'
import TableLoadingRow from '../tableSkeletonRow2'
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'


export default function IssueTable() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useSearchParams();
    const [tab, setTab] = useState<'all' | 'mine'>(params.get('tab') === 'mine' ? 'mine' : 'all');

    const { gitHubIssueManager: gh } = useGitHubIssues(tab === 'mine' ? `NexusMods:${(session as any)?.id} in:body` : undefined);


    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableLoadingRow key={idx} />);

    const setMyIssues = async () => {
        if (status !== 'authenticated') return signIn('nexusmods', { redirect: false })
        const mentioned = `NexusMods:${(session as any)?.id} in:body`
        gh.setSearchQuery(mentioned)
        setTab('mine');
        router.push(`/issues?tab=mine`, { scroll: false });
        gh.setFilters({});
    }

    const setAllIssues = async () => {
        router.push(`/issues`, { scroll: false });
        setTab('all');
        gh.setSearchQuery(undefined);
    }

    const paginate = (type: 'next' | 'prev', id: string) => {
        const newfilters = {...gh.filters}
        if (type === 'next') {
            newfilters.after = id;
            delete newfilters.before
        }
        else {
            newfilters.before = id;
            delete newfilters.after
        }
        gh.setFilters(newfilters);
    }

    

    return (
        <div>
            <div className='grid grid-cols-2 my-4 border-b-2 select-none border-black w-full text-center'>
                <div className={`${tab === 'all' ? 'bg-slate-300' : null} hover:bg-slate-300 px-4 py-2`} onClick={setAllIssues}>All Issues</div>
                <div className={`${tab === 'mine' ? 'bg-slate-300' : null} hover:bg-slate-300 px-4 py-2`} onClick={setMyIssues} title='Not implemented'>My Issues</div>
            </div>
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
            <div className='flex flex-row justify-between my-4'>
                <div>{gh.pageInfo?.hasPreviousPage && <button onClick={() => paginate('next', gh.pageInfo?.startCursor!)}>Previous</button>}</div>
                <div>{gh.pageInfo?.hasNextPage && <button onClick={() => paginate('next', gh.pageInfo?.endCursor!)}>Next</button>}</div>
            </div>
        </div>
    )
}