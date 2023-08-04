'use client'
import { useRouter } from "next/navigation"

interface ICommentPageProps {
    type: 'before' | 'after'
    id: string;
    issueNumber: number;
}

export default function CommentPageButton({ type, id, issueNumber } : ICommentPageProps) {
    const router = useRouter();

    const setOffset = () => {
        const params = new URLSearchParams()
        type === 'before' ? params.append('before', id) : params.append('after', id)
        router.push(`/issues/${issueNumber}?${params.toString()}`);
    }

    return (
        <button onClick={setOffset}>
            {type === 'before' ? 'Previous' : 'Next'}
        </button>
    )
}