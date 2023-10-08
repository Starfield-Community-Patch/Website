import IssueSearchResults from "@/components/issue-table/issueSearchResults";
import { decodeQueryString } from "@/util/GitHub/common";
import { Metadata, ResolvingMetadata } from "next";
import { Orbitron } from "next/font/google";
import { Suspense } from "react";

interface SearchProps {
    params: { q: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

const orb = Orbitron({ subsets: ['latin'] })

export async function generateMetadata({ params, searchParams }:SearchProps, parent: ResolvingMetadata): Promise<Metadata> {
    // read the search parameters
    const q = searchParams.q;
    
    // decode the query
    const decoded = decodeQueryString(q as string);
    const query = decoded.query;
    const labels = decoded.labels ?? [];
    const status = decoded.searchIn;

    const localised = `${labels.length ? `label(s) [ ${labels.join(', ')} ]` : ''} ${status ? `status [ ${status} ]` : ''}`

    // Rebuild into human readable format

    return {
        title: `Search Results${query ? ` for "${query}"` : ''}`,
        description: `Results for issues reported for the Starfield Community Patch ${localised.length ? ` filtered by ${localised}` : ''}`
    }
}

export default function PageSearchResults(props: SearchProps) {
    const decodedProps = decodeQueryString((props.searchParams.q as string).trim());

    return (
        <div>
            <h1 className={orb.className}>Search Results</h1>
            <Suspense>
                <IssueSearchResults query={decodedProps} />
            </Suspense>
        </div>
    )
}