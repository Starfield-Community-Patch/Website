'use client'
import { Suspense, useState } from 'react'
import TableSkeletonRow from '@/components/tableskeletonrow'
import IssueRows from './issueRows'


export default function IssueTable() {
    const [issues, setIssues] = useState<any[] | undefined>(undefined);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableSkeletonRow key={idx} />)

    

    return (
        <div>
            {total ? `${total} issues` : 'Loading...'}
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
                        <IssueRows setIssues={setIssues} />                    
                    </Suspense>
                </tbody>
            </table>
        </div>
    )
}