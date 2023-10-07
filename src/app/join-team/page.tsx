import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import JoinTeamWrapper from '@/components/join-team/joinTeamWrapper'

export const metadata: Metadata = {
    title: 'Join the team',
    description: 'Become a part of the Starfield Community Patch Team by joining our team on GitHub.'
}

//export const dynamic = 'force-dynamic'
//export const revalidate = 86400 // 24 hours, i.e. 24 * 60 * 60 seconds

const orb = Orbitron({ subsets: ['latin'] })

export default async function JoinPage() {

    // if (process.env.NODE_ENV === 'production') return <p>Coming soon!</p>

    return <div>
        <h1 className={orb.className}>Join the Starfield Community Patch Team!</h1>
        <div>
            The SFCP operates out of GitHub. In order to join you&lsquo;ll need a GitHub account. If you don&lsquo;t have one you can register <a href='https://github.com/join' target='_blank'>here</a>.
            The email address entered into the form below <b>must</b> match the one used for your GitHub account or you won&lsquo;t receive the invitation.
        </div>
        <JoinTeamWrapper />
    </div>
}
