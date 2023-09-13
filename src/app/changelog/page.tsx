import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Changelog',
    description: 'Things change, and so does the Starfield Community Patch. See what\'s new here!',
}

const orb = Orbitron({ subsets: ['latin'] })

export default function ChangelogPage() {
    return null

    return (
        <div>
            <h1 className={orb.className}>Changelog</h1>
        </div>
    )
}