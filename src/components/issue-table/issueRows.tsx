import IssueRow from "./issueSingleRow";
import { IGitHubIssueList } from "@/util/GitHub/issues-list";
import { ErrorWithHTTPCode } from "@/util/errors";

interface IIssueRowsProps {
    setIssues: (issues: IGitHubIssueList[]) => void;
    query?: string;
}


export default async function IssueRows(props: IIssueRowsProps) {
    const { query } = props;

    const getIssues = async (): Promise<{ issues: IGitHubIssueList[], totalCount: number }> => {
        try {
            const search = new URLSearchParams()
            if (query && query !== '') search.append('query', query);
            const req = await fetch('/api/issues?'+search.toString(), { next: { revalidate: 1 } });
            if (!req.ok) {
                console.error('Failed to fetch issues', { status: req.status, message: req.statusText })
                throw new ErrorWithHTTPCode(req.status, req.statusText) 
            };
            const res: { issues: IGitHubIssueList[], totalCount: number } = await req.json();
            return res;
        }
        catch(err) {
            console.error('Unexpected error!', err);
            throw err;
        }
    }


    const list = await getIssues()
    // props.setIssues(list.issues)

    

    const noIssues = () => {
        return (
            <tr className=''>
                <td className='col-span-3' colSpan={3}>
                    No issues
                </td>
            </tr>
        )
    }
    if (!list?.issues.length) return noIssues();

    return list?.issues.map((i: IGitHubIssueList) => <IssueRow i={i} key={i.id} />)
}