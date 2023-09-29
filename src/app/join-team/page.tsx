import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import JoinTeamForm from '@/components/join-team/joinTeamForm'
import { Suspense } from 'react'
import JoinTeamWrapper from '@/components/join-team/joinTeamWrapper'

export const metadata: Metadata = {
    title: 'Join the team',
    description: 'Become a part of the Starfield Community Patch Team by joining our team on GitHub.'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function JoinPage() {

    const isProduction = process.env.NODE_ENV === 'production'

    if (!isProduction) return (<div>Coming Soon!</div>)

    return (
        <div>
            <h1 className={orb.className}>Join the Starfield Community Patch Team!</h1>
            <div>
                The SFCP operates out of GitHub. In order to join you&#39;ll need a GitHub account. If you don&#39;t have one you can register <a href='https://github.com/join' target='_blank'>here</a>.
                The email address entered into the form below <b>must</b> match the one used for your GitHub account or you won&#39;t recieve the invitation.
            </div>
            <Suspense fallback='Loading wrapper....'>
                <JoinTeamWrapper />
            </Suspense>
        </div>
    )
}
