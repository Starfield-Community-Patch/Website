'use client'

import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import UserAvatar from "../useravatar"
import { useRouter } from 'next/navigation'

interface IRowProps {
    i: IGitHubIssueList
}

export default function IssueRow({i} : IRowProps) {
    const router = useRouter();

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