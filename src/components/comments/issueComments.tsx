'use client'

import { IGitHubComment, IGitHubCommentsResponse } from "@/util/GitHub/issue-comments";
import { IGitHubPageInfo } from '@/util/GitHub/common'
import { useMemo, useState } from "react";
import CommentLoader from "../commentskeleton";
import IssueComment from "./comment";
import { useRouter, useSearchParams } from 'next/navigation';

interface IIssueCommentProps {
    id: number;
    className?: string;
}

export default function IssueComments(props: IIssueCommentProps) {
    const router = useRouter();
    // Try to use the URL params to pre-fetch the right comments.
    // const params = useSearchParams();
    // const paramCursor = params.get('before') ? { before: params.get('before') } : params.get('after') ? { after: params.get('after') } : null
    // console.log(params)
    const { id, className } = props;
    const [comments, setComments] = useState<IGitHubComment[] | undefined>(undefined)
    const [commentError, setCommentError] = useState<Error | undefined>(undefined);
    const [pageInfo, setPageInfo] = useState<IGitHubPageInfo | undefined>(undefined)
    const [cursor, setCursor] = useState<{ before?: string | null, after?: string | null } | null>(null);

    useMemo(async () => {
        if ((!!comments && !cursor) || !!commentError) return;
        try {
            const params = new URLSearchParams()
            params.set('id', id.toString())
            if (cursor?.after) params.set('after', cursor.after)
            else if (cursor?.before) params.set('before', cursor.before)
            const request = await fetch(`/api/comments?${params.toString()}`, { next: { revalidate: 5, tags: [`${id}_comments`] } });
            if (request.ok) {
                const res: IGitHubCommentsResponse = await request.json()
                setComments(res.data?.repository.issue.comments.nodes || [])
                setPageInfo(res.data?.repository.issue.comments.pageInfo)
                setCursor(null)
            }
            else throw new Error(`Request failed: ${request.status} ${request.statusText}`)
        }
        catch(err) {
            if ((err as any).cause.code === 'ERR_INVALID_URL') return console.log('Fetch error: Invalid URL(?)')
            console.error('Failed to get comments from GitHub', err);
            setCommentError(err as Error);
        }
    }, [id, comments, commentError, cursor]);

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

    const earlierComments = () => {
        if (!pageInfo?.startCursor) return console.error('No start cursor to paginate', pageInfo);
        setCursor({ before: pageInfo?.startCursor })
        const params = new URLSearchParams()
        params.append('before', pageInfo?.startCursor)
        router.push(`/issues/${id}?${params.toString()}`)
    }

    const laterComments = () => {
        if (!pageInfo?.endCursor) return console.error('No end cursor to paginate', pageInfo);
        setCursor({ after: pageInfo?.endCursor })
        const params = new URLSearchParams()
        params.append('after', pageInfo?.startCursor)
        router.push(`/issues/${id}?${params.toString()}`)
    }

    return (
        <div className={className}>
            <div>
            {!!comments && !commentError
            ? comments.length ? comments.map(c => (<IssueComment comment={c} key={c.id} />)) : <b>NO COMMENTS!</b>
            : !commentError ? loading() : errorState()
            }
            </div>
            <div className="w-full grid grid-cols-3">
                {pageInfo?.hasPreviousPage ? <button className="" onClick={() => earlierComments()}>{`<- Prev`}</button> : null}
                {pageInfo?.hasNextPage ? <button className="col-start-3" onClick={() => laterComments()}>{`Next ->`}</button> : null}
            </div>
        </div>
    )
}