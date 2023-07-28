import Image from 'next/image'

interface IAvatarProps {
    githubUser?: {
        login: string;
        avatarUrl: string;
    };
    nexusMods?: {
        memberId: number
        name: string;
        avatar?: string;
    }
    size?: 32 | 64 | 48;
}

export default function UserAvatar(props: IAvatarProps) {
    const { githubUser, nexusMods, size } = props;

    const sizeClass = (size === 64) ? 'w-16 h-16' : (size === 48) ? 'w-12 h-12' : 'w-8 h-8'
      
    const fallBack = () => {
        return (
            <div className={`rounded-full ${sizeClass} bg-stripe-blue text-white text-center leading-8 select-none`} title={githubUser?.login}>
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
                className={`${sizeClass} rounded-full`}
            />
        )
    }
    
    if (!nexusMods?.avatar && !githubUser?.avatarUrl) return fallBack()
    else if (nexusMods?.avatar) return (
        <Image 
            src={nexusMods.avatar}
            alt={nexusMods?.name ?? githubUser?.login}
            width={size ?? 32}            
            height={size ?? 32}
            className={`${sizeClass} rounded-full`}
        />
    )
    else return gitHubAvatar();
}