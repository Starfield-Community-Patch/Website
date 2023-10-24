import { Orbitron } from 'next/font/google'
import contributors from '../app/contributors/contributors.json'
import { ErrorWithHTTPCode } from '@/util/errors';

const orb = Orbitron({ subsets: ['latin'] })

export default async function HomePageBanner() {
    const totalContributors = (contributors as Object[])?.length || 0;
    let fixesCount = 0;

    try {
        const req = await fetch('https://raw.githubusercontent.com/Starfield-Community-Patch/Starfield-Community-Patch/main/CHANGELOG.md', { next: { revalidate: 600 } });
        if (req.ok) {
            const text = await req.text();
            fixesCount = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('\- ')).length;
        }
        else throw new ErrorWithHTTPCode(req.status, req.statusText ?? 'Unable to fetch changelogs');
    }
    catch(err){
        throw err;
    }

    // Probably want to use suspense to load in the totals from an external file/DB
    return (
        <div className={`my-4 h-60 w-auto bg-[url('/hero-art.webp')] bg-cover bg-top rounded-t-md grid grid-cols-2 grid-`}>
        <div className='lg:mt-10 text-center pt-5 pr-5 text-white text-xl lg:text-2xl col-start-2 font-bold'>
          <span className={orb.className}>The Community Patch includes {fixesCount.toLocaleString()} fixes from {totalContributors.toLocaleString()} contributors!</span>
        </div>
      </div>
    )
}