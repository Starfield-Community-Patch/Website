import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReportWizard from '@/components/reporting/reportwizard'

export const metadata: Metadata = {
    title: 'Report an Issue - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function ReportPage() {
    return (
        <div>
            <h1 className={orb.className}>Report an Issue</h1>
            Submissions are currently closed.
            <Suspense fallback={<p>Loading...</p>}>
                <ReportWizard />
            </Suspense>
        </div>
    )
}