import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Report an Issue - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function ReportPage() {
    return (
        <div>
            <h1 className={`text-4xl text-center mb-4 `+orb.className}>Report an Issue</h1>
            Submissions are currently closed.
        </div>
    )
}