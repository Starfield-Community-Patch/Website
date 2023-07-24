'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorWithHTTPCode } from '@/util/errors'
import UserAvatar from '@/components/useravatar'
import TableSkeletonRow from '@/components/tableskeletonrow'

export default function IssueTable() {
    const router = useRouter()
    const [issues, setIssues] = useState<any[] | undefined>(undefined);
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [error, setError] = useState<ErrorWithHTTPCode | undefined>(undefined);

    // Fetch the issues we need!
    useMemo(async () => {
        if (!!issues || !!error) return;
        try {
            const req = await fetch('/api/issues', { next: { revalidate: 1 } });
            if (!req.ok) {
                console.error('Failed to fetch issues', { status: req.status, message: req.statusText })
                setError(new ErrorWithHTTPCode(req.status, req.statusText))
            };
            const res = await req.json();
            setIssues(res.issues);
            setTotal(res.totalCount);
        }
        catch(err) {
            console.error('Unexpected error!', err);
        }
    }, [error, issues]);

    const issueRow = (i: any) => {
        return (
            <tr key={i.number} className='hover:bg-stripe-yellow hover:border-black hover:border-2 hover:cursor-pointer' onClick={() => router.push(`issues/${i.number}`)}>
                <td>{i.title} #{i.number}</td>
                <td>
                    <div className='flex flex-row align-middle gap-2 content-center items-center'>
                        <UserAvatar githubUser={i.author} nexusMods={i.NexusMods} />
                        <div className='basis-3/4 w-10/12 inline object-center align-middle' >{i.NexusMods?.name ?? i.author.login}</div>
                    </div>
                </td>
                <td>💬 {i.comments.totalCount}</td>
            </tr>
        )

    }

    const loadingRows = () => new Array(10).fill(undefined).map((r, idx) => <TableSkeletonRow key={idx} />)


    const noIssues = () => {
        return (
            <tr className=''>
                <td className='col-span-3' colSpan={3}>
                    No issues
                </td>
            </tr>
        )
    }

    const tableError = () => {
        return (
            <tr className=''>
                <td className='text-center w-full h-12 rounded-xl border-red-300 border-2' colSpan={3}>
                    <h2 className='text-2xl mb-4'>{error?.code} - Failed to fetch issues from GitHub</h2>
                    <div>
                        {error?.message}
                    </div>
                    <button onClick={() => setError(undefined)}>🔄 Retry</button>
                </td>
            </tr>
        )
    }

    return (
        <div>
            {total ? `${total} issues` : error ? 'Error!': 'Loading...'}
            <table className='table-fixed w-full'>
                <thead className=''>
                    <tr className=''>
                        <th className='lg:w-1/2'>Issue</th>
                        <th className='lg:w-3/8'>Reporter</th>
                        <th className='lg:w-1/8 w-3/12'>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {!!issues 
                    ? issues.length ? issues.map(issueRow) : noIssues()
                    : !!error ? tableError() : loadingRows()
                    }
                </tbody>
            </table>
        </div>
    )
}