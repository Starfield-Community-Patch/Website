'use client'
import { signIn, useSession } from "next-auth/react"
import CommentFrame from "./commentFrame";
import UserAvatar from "../useravatar";
import { ChangeEvent, useState } from "react";

interface IProps {
    commentId?: string;
}

export default function CommentInput(props: IProps) {
    const { commentId } = props;
    const { data: session, status } = useSession();
    const [comment, setComment] = useState<string>('');
    const [working, setWorking] = useState<boolean>(false);
    const [postError, setPostError] = useState<Error | undefined>(undefined);

    if (!commentId) return <div>Cannot add a comment: Invalid Comment ID!</div>

    const addComment = async () => {
        setPostError(undefined)
        setWorking(true)
        try {
            const form = new FormData();
            form.append('comment', comment)
            const post = await fetch(`/api/comments/add?comment_id=${commentId}`, { method: 'POST', body: form });
            if (!post.ok) {
                console.warn('Network error', post.status, post.statusText)
                throw new Error(post.statusText)
            }
            setWorking(false)
        }
        catch(err) {
            console.error('Failed to post comment', err);
            setPostError((err as Error) ?? new Error('Unknown error'))
            setWorking(false)
        }
    }

    let timeoutId: NodeJS.Timeout

    const setCommentDelayed = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!!timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => setComment(e.target.value), 500)
    }

    const loggedOut = () => {
        return (
        <div className="text-center">
            You must be signed in to a Nexus Mods account to leave a comment.
            <div className="mt-4"><button onClick={() => signIn()}>Sign In</button></div>
        </div>
        )
    }

    return (
        <CommentFrame
            id={'addnew'}
            avatar={<UserAvatar githubUser={{ login: session?.user?.name ?? '', avatarUrl: session?.user?.image ?? '' }} size={48} />}
            userName={'Add Comment'}
            profileUrl="#"
            platformIcon={<></>}
        >
            {status === 'authenticated'
            ?<div>
            <textarea rows={5} className='w-full border-black border-2 mx-auto p-1' onChange={setCommentDelayed} />
            <div className='flex flex-row justify-between content-center'>
                <div><i>Markdown is supported in comments.</i></div>
                <button disabled={comment === '' || working} onClick={() => addComment()}>Add Comment</button>
            </div>
            { postError ? <div className="text-red-500">Error posting comment: {postError.message}</div> : null }
            </div>
            : loggedOut() }
        </CommentFrame>
    )

    return (
        <div>
            <form>
                <textarea rows={5} className='w-full border-black border-2 mx-auto' disabled={status !== 'authenticated'} />
            </form>
            {status === 'authenticated'
            ? <button>Post Comment</button>
            : <p>Not Logged in! <a onClick={() => signIn()}>Sign In</a></p>                
            }
        </div>
    )
}