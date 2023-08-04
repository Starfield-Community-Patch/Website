import IssueRow from "./issueSingleRow";
import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import { ErrorWithHTTPCode } from "@/util/errors";

interface IIssueRowsProps {
    issues: IGitHubIssueList[];
}


export default async function IssueRows(props: IIssueRowsProps) {
    const { issues } = props;
    

    const noIssues = () => {
        return (
            <tr className=''>
                <td className='col-span-3 text-center' colSpan={2}>
                    No issues
                </td>
            </tr>
        )
    }
    if (!issues.length) return noIssues();

    return issues.map((i: IGitHubIssueList) => <IssueRow i={i} key={i.id} />)
}