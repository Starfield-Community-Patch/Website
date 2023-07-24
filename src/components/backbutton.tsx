'use client'
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';

interface IProps {
    href: string;
    label: string;
    icon: string;
}

export default function BackButton(props: IProps) {
    const { href, label, icon } = props;
    const router = useRouter()

    return (
        <button onClick={() => router.push(href)}>
            <Icon path={icon} size={1} className='inline' />{label}
        </button>
    )

}