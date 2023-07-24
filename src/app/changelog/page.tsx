import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Changelog - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function ChangelogPage() {
    return (
        <div>
            <h1 className={`text-4xl text-center mb-4 `+orb.className}>Changelog</h1>
            Nothing to see here!
        </div>
    )
}