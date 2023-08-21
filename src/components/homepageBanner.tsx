import { Orbitron } from 'next/font/google'

const orb = Orbitron({ subsets: ['latin'] })

export default function HomePageBanner() {
    // Probably want to use suspense to load in the totals from an external file/DB
    return (
        <div className={`my-4 h-60 w-auto bg-[url('/hero-art.webp')] bg-cover bg-top rounded-t-md grid grid-cols-2 grid-`}>
        <div className='lg:mt-10 text-center pt-5 pr-5 text-white text-xl lg:text-2xl col-start-2 font-bold'>
          <span className={orb.className}>The Community Patch includes 0 fixes from 4 contributors!</span>
        </div>
      </div>
    )
}