import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contributors - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function ContributorsPage() {
    return (
        <div>
            <h1 className={`text-4xl text-center mb-4 `+orb.className}>Contributors</h1>
            Could your name end up here?
        </div>
    )
}