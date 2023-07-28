
import Image from 'next/image';
import VASCO from './VASCO.png';
import { Orbitron } from 'next/font/google'
import { getRepoAndLabels } from '@/util/GitHub/get-repo-labels';

const orb = Orbitron({ subsets: ['latin'] })

export default async function ReportWizard() {

    const repoInfo = await getRepoAndLabels();

    const vasco = (
        <div className='grid grid-cols-3'>
            <div className=''>
                <Image src={VASCO} alt='VASCO' className='' />
            </div>
            <div className='col-span-2'>
                <div className='border-1 border-black '>
                <h2 className={orb.className}>VASCO says</h2>
                <div className='sb-1 relative border-black border-2 p-2'>
                Remember, the Community Patch is only intended to fix bugs and errors in the base game. Your report should <b>not</b> ask for:
                <ul>
                    <li>New content (new quests, missions, characters, items, etc)</li>
                    <li>Balance changes (outside of correcting obvious errors)</li>
                    <li>Any tweaks that are not inkeeping with the original vision for game</li>
                </ul>
                </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {vasco}
            <div><pre>{JSON.stringify(repoInfo, null, 2)} {process.env.NODE_ENV}</pre></div>
        </div>
    )
}