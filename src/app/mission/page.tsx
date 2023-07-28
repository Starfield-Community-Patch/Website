import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Our Mission - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function MissionPage() {
    return (
        <div>
            <h1 className={orb.className}>Mission Statement</h1>
            Nothing to see here...yet!
        </div>
    )
}