import { ParsedQuery } from "@/util/GitHub/common";
import IssueLabel from "../issueLabel";
import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import StatusLabel from "../statusLabel";

export default function IssueFilters({ filters }: { filters: ParsedQuery }) {
    const { labels, type, status, query, searchIn } = filters;

    const mockLabels: IGitHubLabel[] | undefined = labels?.map(l => ({ name: l, color: 'orange', description: '', id: `search=${l}` }))

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="flex flex-row w-full border-t-2 border-b-2 p-2 my-2 border-black justify-between">
            <div className="self-center align-middle">Results for:  
            { query && <i> {query}</i> }
            { searchIn && <i>in {searchIn.join(', ')}</i> }</div>
            { type && <div className="self-center align-middle">Type: {type}</div> }
            { mockLabels?.length && <div className="self-center align-middle">Labels: {mockLabels?.map(l => <IssueLabel key={l.id} label={l} />)}</div> }
            { status && <div className="self-center align-middle">Status: <StatusLabel label={status}  /></div> }
        </div>
    )
}