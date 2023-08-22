import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ContributorTile from '@/components/contributor'

export const metadata: Metadata = {
    title: 'Contributors - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

interface IContributor {
    name: string;
    avatar: string;
    roles: string[];
    profiles: {
        nexusMods?: string;
        gitHub?: string;
    }
    donateLink?: string;
    accolades?: string[];
}

const exampleContributors: IContributor[] = [
    {
        name: 'Pickysaurus',
        avatar: 'https://forums.nexusmods.com/uploads/profile/photo-thumb-31179975.png',
        roles: [ 'Core Team', 'Founder' ],
        profiles: {
            nexusMods: 'https://www.nexusmods.com/users/31179975',
            gitHub: 'https://github.com/Pickysaurus',
        },
        donateLink: undefined,
        accolades: [
            'First project lead',
            'Created this website'
        ]
    },
    {
        name: 'Halgari',
        avatar: 'https://avatars.githubusercontent.com/u/654621?v=4',
        roles: [ 'Core Team', 'Founder' ],
        profiles: {
            nexusMods: 'https://nexusmods.com/users/17252164',
            gitHub: 'https://github.com/halgari',
        },
        donateLink: undefined,
        accolades: [
            // 'Cyberpunk Haircut'
        ]
    },
    {
        name: 'Noggog',
        avatar: 'https://avatars.githubusercontent.com/u/24981326?v=4',
        roles: [ 'Core Team', 'Founder' ],
        profiles: {
            nexusMods: undefined,
            gitHub: 'https://github.com/Noggog',
        },
        donateLink: undefined,
        accolades: [
            'Creator of Spriggit'
        ]
    },
    {
        name: 'SimonMagus',
        avatar: 'https://forum.nexusmods.com/uploads/profile/photo-thumb-67410746.png',
        roles: [ 'Core Team', 'Founder' ],
        profiles: {
            nexusMods: 'https://www.nexusmods.com/users/67410746',
            gitHub: undefined,
        },
        donateLink: undefined,
        accolades: [
            // 'Wrote the contribution guidelines'
        ]
    },
]

export default function ContributorsPage() {
    return (
        <div>
            <h1 className={orb.className}>Contributors</h1>
            <Suspense fallback={'Loading...'}>
            {/* <h2 className={orb.className}>Core Team</h2>
            <p>The current, active members of the Core Team. These users are currently in charge of maintaining the Starfield Community Patch.</p> */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1'>
                { exampleContributors.map((c, i) => (<ContributorTile key={`${c.name}-${i}`} contributor={c} />)) }
            </div>
            {/* <h2 className={orb.className}>Contributors</h2>
            <p>These users have submitted valuable fixes, raised detailed issues or generally been very helpful to the project.</p>
            <div className='grid grid-cols-2 lg:grid-cols-4'>

            </div> */}
            </Suspense>
        </div>
    )
}