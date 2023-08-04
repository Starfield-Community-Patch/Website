import { Icon } from '@mdi/react'
import { Orbitron } from 'next/font/google'
import Image from 'next/image'

const orb = Orbitron({ subsets: ['latin'] })

interface IProps {
    icon?: string;
    customIcon?: string;
    label: string;
}

export default function NavButton(props: IProps) {
    const { icon, label, customIcon } = props;

    return (
        <div className='uppercase leading-10 flex flex-wrap-nowrap justify-between h-12 nav-item align-middle items-center font-normal hover:font-extrabold text-black'>
            <div className='text-ellipsis truncate'>
            {customIcon 
            ? <Image 
                src={customIcon}
                alt={label}
                width={24}
                height={24}
                className='inline mr-2'
            /> 
            : null}
            {icon ? <Icon path={icon || ''} size={1} className='inline mr-2' /> : null }
            <p className={`${orb.className} inline`}>{label}</p>
            </div>
            <div className='grid grid-rows-4 overflow-clip nav-stripes h-max min-w-[12px]'>
                <div 
                    style={{'--ribbon-index': '1'} as any} 
                    className='stripe bg-stripe-red w-3 h-2 transition-transform ease-stripe-ease duration-150 delay-ribbon scale-x-0 origin-stripe-wipe' 
                />
                <div 
                    style={{'--ribbon-index': '2'} as any} 
                    className='stripe bg-stripe-orange w-3 h-2 transition-transform ease-stripe-ease duration-150 delay-ribbon scale-x-0 origin-stripe-wipe'
                />
                <div 
                    style={{'--ribbon-index': '3'} as any} 
                    className='stripe bg-stripe-yellow w-3 h-2 transition-transform ease-stripe-ease duration-150 delay-ribbon scale-x-0 origin-stripe-wipe'
                />
                <div 
                    style={{'--ribbon-index': '4'} as any} 
                    className='stripe bg-stripe-blue w-3 h-2 transition-transform ease-stripe-ease duration-150 delay-ribbon scale-x-0 origin-stripe-wipe'
                />                
            </div>
        </div>
    )
}