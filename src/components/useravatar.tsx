import { INexusModsUser } from '@/util/NexusMods/multiuserquery';
import Image from 'next/image'

interface IAvatarProps {
    githubUser?: {
        login: string;
        avatarUrl: string;
    };
    nexusMods?: INexusModsUser;
    size?: 32 | 64 | 48 | 16;
}

export default function UserAvatar(props: IAvatarProps) {
    const { githubUser, nexusMods, size } = props;

    // const sizeClass = (size === 64) ? 'w-16 h-16' : (size === 48) ? 'w-12 h-12' : 'w-8 h-8'

    let sizeClass = 'w-8 h-8'
    switch(size) {
        case 64: {
            sizeClass = 'w-16 h-16'
            break;
        }
        case 48: {
            sizeClass = 'w-12 h-12'
            break;
        }
        case 32: {
            sizeClass = 'w-8 h-8'
            break;
        }
        case 16: {
            sizeClass = 'w-4 h-4'
            break;
        }
        default: {
            sizeClass = 'w-8 h-8'
            break;
        }
    }
      
    const fallBack = () => {
        return (
            <div className={`rounded-full ${sizeClass} bg-stripe-blue text-white text-center leading-8 select-none inline-block`} title={githubUser?.login}>
                {githubUser?.login[0]?.toUpperCase() ?? ''}
            </div>
        )
    }

    const gitHubAvatar = () => {
        if (!githubUser) return null;
        return (
            <Image 
                src={githubUser.avatarUrl}
                alt={githubUser.login}
                width={size ?? 32}            
                height={size ?? 32}
                className={`${sizeClass} rounded-full inline-block`}
            />
        )
    }
    
    if (!nexusMods?.avatar && !githubUser?.avatarUrl) return fallBack()
    else if (nexusMods?.avatar) return (
        <Image 
            src={nexusMods.avatar}
            alt={nexusMods?.name ?? githubUser?.login ?? ''}
            width={size ?? 32}            
            height={size ?? 32}
            className={`${sizeClass} rounded-full inline-block`}
        />
    )
    else return gitHubAvatar();
}