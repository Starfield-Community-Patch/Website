'use client'

import { IGitHubComment, IGitHubCommentPageInfo, IGitHubCommentsResponse } from "@/util/GitHub/issues";
import { useState } from "react";
import IssueBody from "../issueBody";
import RelativeDate from "../relativeDate";
import { mdiUpdate } from "@mdi/js";
import UserAvatar from "../useravatar";
import GitHub from '../sidebar/github-mark.svg';
import NexusMods from '../sidebar/Nexus Icon.svg';
import Image from "next/image";

interface IIssueCommentProps {
    id: number;
    className?: string;
}

export default function IssueComments(props: IIssueCommentProps) {
    const { id, className } = props;
    const [comments, setComments] = useState<IGitHubComment[] | undefined>(undefined)
    const [pageInfo, setPageInfo] = useState<IGitHubCommentPageInfo | undefined>(undefined)

    const getComments = async () => {
        try {
            const request = await fetch(`/api/comments?id=${id}`);
            if (request.ok) {
                const res: IGitHubCommentsResponse = await request.json()
                setComments(res.data?.repository.issue.comments.nodes || [])
                setPageInfo(res.data?.repository.issue.pageInfo)
            }
            else throw new Error(`Request failed: ${request.status} ${request.statusText}`)
        }
        catch(err) {
            alert(err)
        }
        
    }

    const commentBlock = (comment: IGitHubComment, idx: number) => {
        const nexusProfile = !!comment.NexusMods
        const profileUrl = comment.NexusMods ? `https://nexusmods.com/users/${comment.NexusMods.memberId}` : `https://github.com/${comment.author.login}`;

        return (
        <div className="w-full grid grid-cols-10 grid-rows-3 p-4" key={`comment-${comment.id}`} id={comment.id}>
            <div className="hidden lg:block col-span-1 row-span-3 p-2">
                <UserAvatar nexusMods={comment.NexusMods} githubUser={comment.author} size={48} />
            </div>
            <div className="col-span-10 lg:col-span-9 row-span-1 text-right bg-[#2f4dd445] border-2 border-black grid grid-cols-2 p-2">
                <div className="text-left px-2 items-center">
                    <b>
                        {comment.NexusMods?.name ?? comment.author.login}
                        <a href={profileUrl}><Image src={nexusProfile ? NexusMods : GitHub} width={18} height={18} alt={'Profile platform'} className="inline ml-2" /></a>
                    </b>
                </div>
                <RelativeDate date={comment.createdAt} icon={mdiUpdate} label='Created At' />
            </div>
            <div className="col-span-10 lg:col-span-9 row-span-2 border-2 border-black p-2">
                <IssueBody body={comment.body} />
            </div>
        </div>
        )
    }

    return (
        <div className={className}>
            <div>
            <button onClick={() => getComments()}>Get Comments</button>
            {!!comments
            ? <pre>{comments.map(commentBlock)}</pre>
            : <b>NO COMMENTS!</b>
            }
            </div>
            <div>{`<- Prev`} {`Next ->`}</div>
            <div>
                <pre>
                {/* {JSON.stringify(comments, null, 2)} */}
                </pre>
            </div>
        </div>
    )
}