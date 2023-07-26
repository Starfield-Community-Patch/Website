'use client'
import { signIn, useSession } from "next-auth/react"

interface IProps {
    commentId?: string;
}

export default function CommentInput(props: IProps) {
    const { commentId } = props;
    const { data: session, status } = useSession();

    if (!commentId) return <div>Cannot add a comment: Invalid Comment ID!</div>

    // const addComment = async () => {
    //     try {
    //         const form = new FormData();
    //         form.append('comment', 'Testing comment via the API')
    //         const post = await fetch(`/api/comments/add?comment_id=${commentId}`, { method: 'POST', body: form });
    //     }
    //     catch(err) {
    //         console.log(err);
    //         alert('Error posting comment!')
    //     }
    // }

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