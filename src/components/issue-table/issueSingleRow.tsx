'use client'

import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import UserAvatar from "../useravatar"
import { useRouter } from 'next/navigation'
import RelativeDateText from "../relativeDateText";
import IssueLabel from "../issueLabel";

interface IRowProps {
    i: IGitHubIssueList
}

export default function IssueRow({i} : IRowProps) {
    const router = useRouter();

    return (
        <tr className='border-x-white border-2 hover:cursor-pointer py-2 hover:bg-slate-200' onClick={() => router.push(`issues/${i.number}`)}>
            <td>
                <div className="text-lg font-semibold line-clamp-1">
                    {i.title}
                </div>
                {i.labels.nodes.length > 0 && <div className="text-xs">
                    {i.labels.nodes.map(l => <IssueLabel label={l} key={`${i.id}-${l.id}`} size="small"/>)}
                </div>}
                <div className="text-sm items-center align-middle content-center place-content-center">
                    Opened by
                    <span className="mx-1 hover:text-stripe-blue"><UserAvatar githubUser={i.author} nexusMods={i.NexusMods} size={16} />
                    {i.NexusMods?.name ?? i.author.login}
                    </span>
                    <span className=""><RelativeDateText date={i.updatedAt} format="short" /> | </span>
                    <span className="block lg:inline">Updated <RelativeDateText date={i.updatedAt} format="short" /></span>
                </div>
            </td>
            <td>
                💬 {i.comments.totalCount}
            </td>
        </tr>
    )
}