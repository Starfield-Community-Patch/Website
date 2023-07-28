import { Orbitron } from 'next/font/google'
import { getRepoAndLabels } from '@/util/GitHub/get-repo-labels';
import VASCOTip from './vascotip';

const orb = Orbitron({ subsets: ['latin'] })

export default async function ReportWizard() {

    const env: 'development' | 'production' | 'test' = process.env.NODE_ENV;

    const repoInfo = await getRepoAndLabels();

    if (env === 'production') return <p>Not available yet!</p>

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