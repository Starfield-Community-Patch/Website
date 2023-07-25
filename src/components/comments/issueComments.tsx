'use client'

import { IGitHubComment, IGitHubCommentPageInfo, IGitHubCommentsResponse } from "@/util/GitHub/issues";
import { useMemo, useState } from "react";
import CommentLoader from "../commentskeleton";
import IssueComment from "./comment";

interface IIssueCommentProps {
    id: number;
    className?: string;
}

export default function IssueComments(props: IIssueCommentProps) {
    const { id, className } = props;
    const [comments, setComments] = useState<IGitHubComment[] | undefined>(undefined)
    const [commentError, setCommentError] = useState<Error | undefined>(undefined);
    const [pageInfo, setPageInfo] = useState<IGitHubCommentPageInfo | undefined>(undefined)

    useMemo(async () => {
        if (!!comments || !!commentError) return;
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
            if ((err as any).cause.code === 'ERR_INVALID_URL') return console.log('Fetch error: Invalid URL(?)')
            console.error('Failed to get comments from GitHub', err);
            setCommentError(err as Error);
        }
    }, [id, comments, commentError]);

    const loading = () => {
        return (
            <div>
            <CommentLoader />
            <CommentLoader />  
            <CommentLoader />  
            <CommentLoader />  
            <CommentLoader />          
            </div>
        )
    }

    const errorState = () => {
        return (
            <div className="w-full rounded bg-red-500 text-white text-center p-16">
                <div className="text-xl">Failed to fetch comments from GitHub</div>
                <div>{commentError?.message}</div>
                <button onClick={() => setCommentError(undefined)}>Retry</button>
            </div>
        )
    }

    return (
        <div className={className}>
            <div>
            {!!comments && !commentError
            ? comments.length ? comments.map(c => (<IssueComment comment={c} key={c.id} />)) : <b>NO COMMENTS!</b>
            : !commentError ? loading() : errorState()
            }
            </div>
            <div>{`<- Prev`} {`Next ->`}</div>
        </div>
    )
}