import { Icon } from '@mdi/react'
import { mdiEarth, mdiListStatus, mdiBug, mdiMedal, mdiRocketLaunch, mdiMessage, mdiDownload, mdiHistory, mdiBriefcasePlus, mdiAlert } from '@mdi/js'
import type { Metadata } from 'next'
import { Orbitron, Roboto } from 'next/font/google'
import Link from 'next/link'
import HomePageBanner from '@/components/homepageBanner'
import { metadata as layoutMetadata } from './layout'

const orb = Orbitron({ subsets: ['latin'] })
const robo400 = Roboto({ weight: "400", subsets: ['latin'] })

// Layout metadata sadly doesn't apply to routes at the same level so we have to manually add it here
export const metadata: Metadata = {
  ...layoutMetadata,
  title: 'Home | Starfield Community Patch',
  description: 'The home of the Starfield Community Patch project.',
}

export default function Home() {
  return (
    <main>
      <h1 className={`text-4xl text-center mb-4 `+orb.className}>Welcome explorer!</h1>
      <HomePageBanner />
      <span className={robo400.className}>
      <p className='mb-4'>
        The Starfield Community Patch (SFCP) project is a collective effort by mod authors and the wider player community of Starfield to fix bugs, errors and other inconsistencies present in the game. This includes tweaks, typos and other changes that may have been missed (or not yet released) by the developers. The overall goal is to improve the vanilla experience for all players.
      </p>
      </span>
      <hr />
      <div className='flex space-x-4 text-center place-content-around my-4'>
        <Link href='/download#PC' className='w-[40%]'><button className='p-8 bg-stripe-blue rounded-md text-xl hover:bg-stripe-orange text-white'>Download (PC)</button></Link>
        <Link href='/download#Xbox' className='w-[40%]'><button className='p-8 bg-stripe-blue rounded-md text-xl hover:bg-stripe-orange text-white'>Download (Xbox)</button></Link>
      </div>
      {/* <div className='text-center border-2 lg:mx-12 bg-stripe-orange text-white p-2'>
        <Icon path={mdiAlert} size={1} className='inline m-2' />
        SFCP is not yet available on Xbox Series X/S.
      </div> */}
      <hr />
      <h1 className={`text-4xl text-center my-4 `+orb.className}>The Community Patch needs you!</h1>
      <p>
        Calling all pilots! We need your help to find, document and fix bugs as part of this project. If you&apos;ve spotted something weird in Starfield and can reproduce it on a new save please report an issue.
      </p>
    </main>
  )
}