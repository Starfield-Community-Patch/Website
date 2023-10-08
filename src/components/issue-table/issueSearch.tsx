import { ChangeEvent, FormEvent, useState } from "react"

interface IProps {
    initialValue?: string;
    onSubmit?: (newQuery?: string, event?: FormEvent) => void; 
}

export default function IssueSearch(props: IProps) {
    const { initialValue } = props;
    const [query, setQuery] = useState<string>();

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'enter' && query) {
            event.preventDefault();
            onSubmit();
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)

    // This is a temporary implementation until the search can be built into the website more effectively
    const onSubmit = (event?: FormEvent) => {
        if (props.onSubmit) return props.onSubmit(query, event);
        event?.preventDefault();        
        window.open(buildSearchUrl(query), '_blank', 'noreferrer')
    }

    console.log('Init value', initialValue)

    return (
        <form className='flex' onSubmit={onSubmit}>
            <input 
                type='text' 
                className='w-full p-2' 
                placeholder='🔍 Search Issues on GitHub' 
                value={query ?? initialValue} 
                onChange={handleChange} 
                onKeyDown={handleKeyPress} 
            />
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