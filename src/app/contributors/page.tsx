import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ContributorTile from '@/components/contributor'
import contributorList from './contributors.json'
const contributors: IContributor[] = contributorList as IContributor[];

export const metadata: Metadata = {
    title: 'Contributors',
    description: 'The people who make the Starfield Community Patch possible.',
}

const orb = Orbitron({ subsets: ['latin'] })

interface IContributor {
    name: string;
    avatar?: string;
    roles: string[];
    profiles: {
        nexusMods?: string;
        gitHub?: string;
        reddit?: string;
    }
    donateLink?: string;
    accolades?: string[];
}

export default function ContributorsPage() {
    return (
        <div>
            <h1 className={orb.className}>Contributors</h1>
            <Suspense fallback={'Loading...'}>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1'>
                { contributors.map((c, i) => (<ContributorTile key={`${c.name}-${i}`} contributor={c} />)) }
            </div>
            </Suspense>
        </div>
    )
}