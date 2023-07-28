import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import IssueTable from '@/components/issueTable'

const orb = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Issue List - Starfield Community Patch'
}

export default function IssuePage() {
    return (
        <div>
            <h1 className={orb.className}>Community Patch Issue List</h1>
            <IssueTable />
        </div>
    )
}