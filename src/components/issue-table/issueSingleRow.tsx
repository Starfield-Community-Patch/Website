'use client'

import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import UserAvatar from "../useravatar"
import { useRouter } from 'next/navigation'
import RelativeDateText from "../relativeDateText";
import IssueLabel from "../issueLabel";
import Image from "next/image";
import Star from './star.webp';

interface IRowProps {
    i: IGitHubIssueList
}

export default function IssueRow({i} : IRowProps) {
    const router = useRouter();

    const stateIndicator = () => (
        <span>
            <Image 
            src={Star}
            alt={i.state}
            className={i.state === 'CLOSED' ? 'grayscale opacity-50' : undefined}
            width={32}
            height={32}
            title={i.state}
            />
        </span>
    )

    return (
        <tr className='border-x-white border-2 hover:cursor-pointer py-2 hover:bg-slate-200' onClick={() => router.push(`/issues/${i.number}`)}>
            <td>
                {stateIndicator()}
            </td>
            <td>
                <div className="text-lg font-semibold line-clamp-1">
                    <a href={`/issues/${i.number}`} className="text-black">{i.title}</a>
                </div>
                {i.labels.nodes.length > 0 && <div className="text-xs line-clamp-2 overflow-x-auto">
                    {i.labels.nodes.map(l => <IssueLabel label={l} key={`${i.id}-${l.id}`} size="small"/>)}
                </div>}
                <div className="text-sm items-center align-middle content-center place-content-center mb-4">
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