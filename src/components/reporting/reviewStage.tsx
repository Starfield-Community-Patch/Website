import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import IssueLabel from "../issueLabel";
import IssueBody from "../issueBody";
import { IReportBody } from "./reportwizard";
import { ErrorWithHTTPCode } from "@/util/errors";
import { useRouter } from "next/navigation";
import { IGitHubAddIssueResponse } from "@/util/GitHub/create-issue";
import { useState } from "react";

interface IReviewProps {
    body: IReportBody;
    platformLabel?: IGitHubLabel
    typeLabel?: IGitHubLabel
    dlcLabels: Set<IGitHubLabel>
    prev: () => void;
    repoId: string;
}

export default function ReviewStage(props: IReviewProps) {
    const {prev, body, platformLabel, typeLabel, dlcLabels, repoId } = props;
    const router = useRouter()
    const [submitError, setSubmitError] = useState<Error | undefined>(undefined)
    const [submitting, setSubmitting] = useState<boolean>(false)

    const md = buildMarkdown(body);
    const labels: (IGitHubLabel | undefined)[] = [platformLabel, ...dlcLabels, typeLabel]

    const submitIssue = async () => {
        setSubmitError(undefined)
        setSubmitting(true)
        try {
            const form = new FormData();
            form.append('title', body.title as string)
            form.append('body', md)
            form.append('labels', labels.filter(l => l !== undefined).map(l => (l as IGitHubLabel).id).join(','))
            const params = new URLSearchParams()
            params.append('repo_id', repoId)
            const url = 'api/issue/create?'+params.toString()
            const submit = await fetch(url, {
                method: 'POST',
                body: form
            });
            if (submit.ok) {
                const res: IGitHubAddIssueResponse = await submit.json();
                const issueNumber: number = res.data?.createIssue?.issue?.number;
                if (issueNumber) return router.push(`issues/${res.data.createIssue.issue.number}`);
                else throw new Error('Unknown error!');
            }
            else throw new ErrorWithHTTPCode(submit.status, submit.statusText);
        }
        catch(err) {
            console.error(err);
            setSubmitError(err as Error)
            setSubmitting(false)
        }
    }

    return (
        <div>
            Here is a summary of your report. Once you are happy with it, you can submit it.
            <div className="border-2 border-black p-4 m-4">
            <h2>{body.title}</h2>
            <hr/>
            <IssueBody body={md} />
            <hr />
            {labels.map(l => l && <IssueLabel label={l} key={l.id} />)}
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button disabled={submitting} className={submitting ? 'animate-pulse' : undefined} onClick={() => submitIssue()}>Submit</button>
            </div>
            {submitError 
            ? <div className="w-full rounded-md bg-red-300 p-4">
                <b>Error submitting issue!</b>
                <pre>
                {JSON.stringify(submitError)}
                </pre>
            </div> 
            : null}
        </div>
    )

}

function buildMarkdown(body: IReportBody): string {
    let result = ''
    if (body.summary) result = result + `${body.summary}\n\n---`;
    const qs = Object.values(body.questions!).sort((a,b) => a.priority - b.priority);
    const questions = qs.map(q => `## ${q.title}\n${q.answer}`);
    result = `${result}\n\n${questions.join('\n\n')}`
    
    return result
}