import { mdiEarth, mdiListStatus, mdiBug, mdiMedal, mdiRocketLaunch, mdiMessage, mdiDownload, mdiHistory, mdiBriefcasePlus } from '@mdi/js'
import NavButton from './navbutton'
import Link from 'next/link'
import Reddit from './reddit.svg'
import Discord from './discord-mark-black.svg'
import GitHub from './github-mark.svg'
import NexusModsMono from './Nexus Logo Icon - Monocrom.svg'
import { signIn, signOut, useSession } from "next-auth/react"
import Image from 'next/image'

interface ISidebarProps {
    showMobile: boolean;
    toggleNav: (state: boolean) => void;
}

export default function Sidebar(props: ISidebarProps) {
    const { showMobile, toggleNav } = props;
    const { data: session, status } = useSession()

    const showMobileClasses = showMobile ? 'float-left absolute top-16 w-auto h-screen' : 'collapse h-0 lg:h-auto lg:visible'

    return (
        <div className={`sticky top-20 bg-white z-50 lg:z-auto lg:flex-initial overflow-auto lg:border-black lg:border-2 lg:m-4 pt-2 pb-2 pl-2 ${showMobileClasses}`}>
            <Link href='/' onClick={() => toggleNav(false)}><NavButton icon={mdiEarth} label={'Home'} /></Link>
            <Link href='/mission' onClick={() => toggleNav(false)}><NavButton icon={mdiRocketLaunch} label={'Mission Statement'} /></Link>
            <Link href='/download' onClick={() => toggleNav(false)}><NavButton icon={mdiDownload} label={'Download'} /></Link>
            <Link href='/changelog' onClick={() => toggleNav(false)}><NavButton icon={mdiHistory} label={'Changelog'} /></Link>
            <hr />
            <Link href='/issues' onClick={() => toggleNav(false)}><NavButton icon={mdiListStatus} label={'Issue List'} /></Link>
            <Link href='/report' onClick={() => toggleNav(false)}><NavButton icon={mdiBug} label={'Report'} /></Link>
            <Link href='/contributors' onClick={() => toggleNav(false)}><NavButton icon={mdiMedal} label={'Contributors'} /></Link>
            <Link href='/join-team' onClick={() => toggleNav(false)}><NavButton icon={mdiBriefcasePlus} label={'Join the Team'} /></Link>
            <hr />
            <Link href='https://nexusmods.com/starfield/mods/1' target='_blank'><NavButton customIcon={NexusModsMono} label={'Nexus Mods ↗'} /></Link>
            <Link href='https://forums.nexusmods.com/index.php?/forum/6928-starfield/' target='_blank'><NavButton icon={mdiMessage} label={'Forums ↗'} /></Link>
            <Link href='https://discord.gg/6R4Yq5KjW2' target='_blank'><NavButton customIcon={Discord} label={'Discord ↗'} /></Link>
            <Link href='https://www.reddit.com/r/starfieldmods/' target='_blank'><NavButton customIcon={Reddit} label={'Reddit ↗'} /></Link>  
            <Link href='https://github.com/Starfield-Community-Patch' target='_blank'><NavButton customIcon={GitHub} label={'GitHub ↗'} /></Link>    
            <div className='mt-4'>
            {status === 'authenticated' ?
            <div className=''>
                <div className='flex flex-row justify-start gap-2'> 
                    <div className=''>
                        <Image src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} width={32} height={32} className='rounded-full' />
                    </div>
                    <div className='col-span-2 flex flex-col pr-4'>
                        {session?.user?.name ?? 'Logged out'}
                        <a onClick={() => signOut({ redirect: false })}>Sign Out</a>
                    </div>
                </div>
            </div>:
            <button onClick={() => signIn('nexusmods', { redirect: false })}>Sign In</button>} 
            </div>
        </div>
    )
}