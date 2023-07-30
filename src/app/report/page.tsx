import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReportWizard from '@/components/reporting/reportwizard'
import { getRepoAndLabels } from '@/util/GitHub/get-repo-labels'

export const metadata: Metadata = {
    title: 'Report an Issue - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default async function ReportPage() {

    const repoInfo = await getRepoAndLabels();

    return (
        <div>
            <h1 className={orb.className}>Report an Issue</h1>
            <Suspense fallback={<p>Loading...</p>}>
                <ReportWizard repo={repoInfo} />
            </Suspense>
        </div>
    )
}