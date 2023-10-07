import { FormEvent, useState } from "react"

export default function IssueSearch() {
    const [query, setQuery] = useState<string>();

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'enter' && query) {
            event.preventDefault();
            onSubmit();
        }
    }

    // This is a temporary implementation until the search can be built into the website more effectively
    const onSubmit = (event?: FormEvent) => {
        event?.preventDefault();        
        window.open(buildSearchUrl(query), '_blank', 'noreferrer')
    }

    return (
        <form className='flex' onSubmit={onSubmit}>
            <input type='text' className='w-full p-2' placeholder='🔍 Search Issues on GitHub' value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyPress} />
            <button disabled={!query} className="p-2  w-1/6 mx-2" >
                Search
            </button>
        </form>
    )
}

function buildSearchUrl(query?: string) {
    const baseUrl = 'https://github.com/Starfield-Community-Patch/Starfield-Community-Patch/issues';
    const searchUrl = `${baseUrl}?q=is%3Aissue+is%3Aopen${query ? `+${encodeURI(query)}`: ''}`
    return searchUrl;
}