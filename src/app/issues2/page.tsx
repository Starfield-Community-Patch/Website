import { Metadata } from "next"
import { Orbitron } from "next/font/google"

const orb = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Issue List - Starfield Community Patch'
}

export default function IssuesListPage() {
    return (
        <div>
            <h1 className={orb.className}>Community Patch Issue List</h1>
        </div>
    )
}