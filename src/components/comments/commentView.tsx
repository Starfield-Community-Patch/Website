import { IGitHubComment } from "@/util/GitHub/issue-comments";
import IssueComment from "./comment";
import { IGitHubPageInfo } from "@/util/GitHub/common";
import CommentPageButton from "./commentPageButton";

export default async function CommentView({ comments, pageInfo, issueNumber }: { comments: IGitHubComment[], issueNumber: number, pageInfo?: IGitHubPageInfo }) {
    return (
        <div>
            {comments.map(c => <IssueComment comment={c} key={c.id} />)}
            {pageInfo && <div className='flex flex-row justify-between my-2'>
                <div>
                    {pageInfo.hasPreviousPage && <CommentPageButton issueNumber={issueNumber} id={pageInfo.startCursor} type='before' />}
                </div>
                <div>
                    {pageInfo.hasNextPage && <CommentPageButton issueNumber={issueNumber} id={pageInfo.endCursor} type='after' />}
                </div>
            </div>}
        </div>
    )
}