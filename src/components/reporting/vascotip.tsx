import Image from 'next/image';
import VASCO from './VASCO.png';
import { Orbitron } from 'next/font/google'
import { PropsWithChildren } from 'react';

const orb = Orbitron({ subsets: ['latin'] })

export default function VASCOTip(props : PropsWithChildren<{}>) {
    const { children } = props

    return (
        <div className='grid grid-cols-3'>
            <div className=''>
                <Image src={VASCO} alt='VASCO' className='' />
            </div>
            <div className='col-span-2'>
                <div className='border-1 border-black '>
                <h2 className={orb.className}>VASCO says</h2>
                <div className='sb-1 relative border-black border-2 p-2'>
                    {children}
                </div>
                </div>
            </div>
        </div>
    )
}