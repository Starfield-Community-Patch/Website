import IssueRow from "./issueSingleRow";
import { IGitHubIssueList } from "@/util/GitHub/issues-list";

interface IIssueRowsProps {
    issues?: IGitHubIssueList[];
    loader: () => JSX.Element[];
}


export default async function IssueRows(props: IIssueRowsProps) {
    const { issues, loader } = props;
    

    const noIssues = () => {
        return (
            <tr className=''>
                <td className='col-span-3 text-center' colSpan={2}>
                    No issues
                </td>
            </tr>
        )
    }
    if (!issues) return loader();
    if (!issues.length) return noIssues();

    return issues.map((i: IGitHubIssueList) => <IssueRow i={i} key={i.id} />)
}