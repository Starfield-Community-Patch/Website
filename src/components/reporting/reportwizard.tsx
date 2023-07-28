import { getRepoAndLabels } from '@/util/GitHub/get-repo-labels';
import VASCOTip from './vascotip';

export default async function ReportWizard() {

    const env: 'development' | 'production' | 'test' = process.env.NODE_ENV;

    if (env === 'production') return <p>Not available yet!</p>

    const repoInfo = await getRepoAndLabels();

    return (
        <div>
            <VASCOTip>
            Remember, the Community Patch is only intended to fix bugs and errors in the base game. Your report should <b>not</b> ask for:
                <ul>
                    <li>New content (new quests, missions, characters, items, etc)</li>
                    <li>Balance changes (outside of correcting obvious errors)</li>
                    <li>Any tweaks that are not inkeeping with the original vision for game</li>
                </ul>
            </VASCOTip>
            <div><pre>{JSON.stringify(repoInfo, null, 2)}</pre></div>
        </div>
    )
}