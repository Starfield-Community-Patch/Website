import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReportWizard from '@/components/reporting/reportwizard'
import { getRepoAndLabels } from '@/util/GitHub/get-repo-labels'
import CountDownTimer from '@/components/countdown/countdownTimer'

export const metadata: Metadata = {
    title: 'Report an Issue - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default async function ReportPage() {

    const repoInfo = await getRepoAndLabels();

    const showCountdown = new Date().getTime() <= 1693526400000

    const isProduction = process.env.NODE_ENV === 'production'

    return (
        <div>
            <h1 className={orb.className}>Report an Issue</h1>
            <Suspense fallback={<p>Loading...</p>}>
                {(!showCountdown || !isProduction) && <ReportWizard repo={repoInfo} />}
                {showCountdown && <div className='text-center border-2 border-black p-4'>
                    <h2 className={orb.className}>Starfield launches in:</h2>
                    <CountDownTimer date={1693526400000} />
                    <p>Come back once you&#39;ve played the game to report issues!</p>
                </div>}
            </Suspense>
        </div>
    )
}
