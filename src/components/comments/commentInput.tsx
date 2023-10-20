'use client'
import { signIn, useSession } from "next-auth/react"
import CommentFrame from "./commentFrame";
import UserAvatar from "../useravatar";
import { useState } from "react";
import { useRouter } from 'next/navigation'

interface IProps {
    issueId: string;
    onSubmit: (c: string) => Promise<void>;
}

export default function CommentInput(props: IProps) {
    const { issueId, onSubmit } = props;
    const router = useRouter()
    const { data: session, status } = useSession();
    const [comment, setComment] = useState<string>('');
    const [working, setWorking] = useState<boolean>(false);
    const [postError, setPostError] = useState<Error | undefined>(undefined);

    if (!issueId) return <div>Cannot add a comment: Invalid Issue ID!</div>

    const addComment = async () => {
        setPostError(undefined)
        setWorking(true)
        try {
            await onSubmit(comment);
            setComment('');
            setWorking(false);
        }
        catch(err) {
            console.error('Failed to post comment', err);
            setPostError((err as Error) ?? new Error('Unknown error'))
            setWorking(false)
        }
    }

    const loggedOut = () => {
        return (
        <div className="text-center">
            You must be signed in to a Nexus Mods account to leave a comment.
            <div className="mt-4"><button onClick={() => signIn('nexusmods')}>Sign In</button></div>
        </div>
        )
    }

    return (
        <CommentFrame
            id={'addnew'}
            avatar={<UserAvatar githubUser={{ login: session?.user?.name ?? '', avatarUrl: session?.user?.image ?? '' }} size={48} />}
            userName={'Add Comment'}
            profileUrl="#"
            platformIcon={null}
        >
            {status === 'authenticated'
            ?<div>
            <textarea rows={5} className='w-full border-black border-2 mx-auto p-1' onChange={(e) => setComment(e.target.value)} value={comment} />
            <div className='flex flex-col lg:flex-row justify-between content-center'>
                <div><i>Markdown is supported in comments.</i></div>
                <button disabled={comment === '' || working} onClick={() => addComment()}>Add Comment</button>
            </div>
            { postError ? <div className="text-red-500">Error posting comment: {postError.message ?? 'Unknown error'}</div> : null }
            </div>
            : loggedOut() }
        </CommentFrame>
    )
}