import { Orbitron, Roboto } from 'next/font/google'
import Link from 'next/link';

const orb = Orbitron({ subsets: ['latin'] })

export default function DownloadPage() {
    return (
        <div>
            <div>
                <h1 className={orb.className} id='PC'>Download for PC</h1>
                Get it on Nexus Mods, or an alternative
            </div>
            <div>
                <h1 className={orb.className} id='Xbox'>Download for Xbox</h1>
                Get it on Bethesda.net, or an alternative
            </div>
        </div>
    )
}