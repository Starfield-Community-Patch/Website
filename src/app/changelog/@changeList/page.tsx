import { ErrorWithHTTPCode } from "@/util/errors";
import { useRemarkSync } from 'react-remark';

export default async function ChangeLog() {
    // Fetch the changelog from GitHub
    let changelog = '';
    try {
        const req = await fetch('https://raw.githubusercontent.com/Starfield-Community-Patch/Starfield-Community-Patch/main/CHANGELOG.md');
        if (req.ok) {
            changelog = await req.text()
        }
        else throw new ErrorWithHTTPCode(req.status, req.statusText ?? 'Unable to fetch changelogs');
    }
    catch(err){
        throw err;
    }

    const rendered = RemarkRendered(changelog);

    return rendered
}

const RemarkRendered = (text: string) => useRemarkSync(text);