'use client'

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"
import CommentLoader from "./commentskeleton";
import CommentInput from "./commentInput";
import CommentView from "./commentView";
import useComments from "@/hooks/useComment";
import { Orbitron } from "next/font/google";

const orb = Orbitron({ subsets: ['latin'] })

export default function CommentContainer({ id, number }: { id: string, number: number }) {
    const params = useSearchParams()    
    const router = useRouter()
    const { comments, onSubmit, pageInfo, setOffset, offset, total } = useComments(number, id);

    // Set the comment pagination (if applicable)
    const before = params.get('before'); 
    const after = params.get('after');
    if (before && before !== offset?.before) setOffset({ before })
    else if (after && after !== offset?.after) setOffset({ after })



    const loadingComments = () => (
        <div>
            <CommentLoader />
            <CommentLoader />  
            <CommentLoader />  
            <CommentLoader />  
            <CommentLoader />          
        </div>
    )

    const clearOffsets = async () => {
        router.push(`/issues/${number}`)
        setOffset(undefined)
    }

    const offsetNotice = () => (
        <div className="w-full flex flex-row items-center justify-between border-2 border-white bg-stripe-blue text-white p-4">
            Comments filtered by offset. <a className="text-white underline" onClick={clearOffsets}>Remove filter</a>
        </div>
    )

    return (
        <div>
            <h2 id='comments' className={`mt-4 `+orb.className}>Comments ({total ?? 0})</h2>
            {!!offset && offsetNotice()}
            <Suspense fallback={loadingComments()}>
                <div>
                    <CommentView comments={comments} pageInfo={pageInfo} issueNumber={number} />
                </div>
            </Suspense>
            <hr />
            <CommentInput 
            issueId={id}
            onSubmit={onSubmit}
            />
        </div>
    )
}