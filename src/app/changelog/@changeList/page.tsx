import { ErrorWithHTTPCode } from "@/util/errors";

import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import ReactMarkdown from 'react-markdown'
import removeComments from 'remark-remove-comments';

export default async function ChangeLog() {
    // Fetch the changelog from GitHub
    let changelog = '';
    try {
        const req = await fetch('https://raw.githubusercontent.com/Starfield-Community-Patch/Starfield-Community-Patch/main/CHANGELOG.md', { next: { revalidate: 600 } });
        if (req.ok) {
            changelog = await req.text()
        }
        else throw new ErrorWithHTTPCode(req.status, req.statusText ?? 'Unable to fetch changelogs');
    }
    catch(err){
        throw err;
    }

    return <ReactMarkdown remarkPlugins={[removeComments, remarkGfm]}>{changelog}</ReactMarkdown>
}