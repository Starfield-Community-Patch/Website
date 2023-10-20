'use client';

import Header from '@/components/layout/header'
import Sidebar from '@/components/sidebar/sidebar'
import Footer from '@/components/layout/footer'
import { useEffect, useState } from 'react';
import { SessionProvider } from "next-auth/react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showNav, setShowNav] = useState<boolean>(false);

  const toggleNav = (newState?: boolean) => setShowNav(newState !== undefined ? newState : !showNav)

  const handleResize = () => {
    if (window.innerWidth > 640) setShowNav(false)
  }

  useEffect(() => {
    window?.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <>
    <Header toggleNav={toggleNav} />
    <SessionProvider>
    <div className='grid grid-cols-1 lg:grid-cols-[30%_70%] w-full bg-white text-black lg: pt-16'>
      <div>
        <Sidebar showMobile={showNav} toggleNav={toggleNav} />
      </div>
      <div className={`mb-4 p-4 ${showNav ? 'pt-8 opacity-50' : null}`} onClick={() => showNav ? setShowNav(false) : null}>{children}</div>
    </div>
    </SessionProvider>
    <Footer />
  </>
}


// function useWindowSize() {
//   const [windowSize, setWindowSize] = useState<{[key: string]: number | undefined}>({ width: undefined, height: undefined });

//   useEffect(() => {
//     function handleResize() {
//       console.log('Handle resize', {windowSize, w: window.innerWidth, h: window.innerHeight})
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight
//       });
//     }

//     window.addEventListener('resize', handleResize)

//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return  windowSize;
// }
