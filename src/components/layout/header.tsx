import { mdiMenu } from '@mdi/js'
import Icon from '@mdi/react'
import { Orbitron } from 'next/font/google'

const orb = Orbitron({ subsets: ['latin'] })

interface IHeaderProps {
    toggleNav: () => void;
}

export default function Header(props: IHeaderProps) {
    return (
        <div className="w-full items-center justify-between  p-4 bg-white border-b-2 fixed top-0 line-clamp-1 z-20">
            <h1 className={'mb-0 text-lg lg:text-xl text-left '+orb.className}>
                <span onClick={() => props.toggleNav()}><Icon path={mdiMenu} size={1} className='inline mr-8 lg:hidden' title='Toggle Navigation'/></span>
                Starfield Community Patch
            </h1>
        </div>
    )
}