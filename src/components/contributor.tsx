import Image from "next/image";
import NexusMods from './sidebar/Nexus Icon.svg';
import GitHub from './sidebar/github-mark.svg';
import Reddit from './sidebar/reddit.svg'
import Icon from "@mdi/react";
import { mdiGift } from "@mdi/js";
import ContributorBadge from "./contributorBadge";

interface IContributor {
    name: string;
    avatar?: string;
    roles: string[];
    profiles: {
        nexusMods?: string;
        gitHub?: string;
        reddit?: string;
    }
    donateLink?: string;
    accolades?: string[];
}

interface IProps{
    contributor: IContributor
}

export default function ContributorTile(props: IProps) {
    const { contributor } = props;

    return (
        <div className="p-2 border-2 border-black my-2">
            <div className="align-center text-center">
                <Image 
                    src={contributor.avatar ?? 'https://nexusmods.com/assets/images/default/avatar.png'}
                    alt={contributor.name}
                    width={64}
                    height={64}
                    className="inline rounded-full"
                />
            </div>
            <div className="text-center font-semibold text-lg">
                {contributor.name}
            </div>
            <div className="text-xs text-center line-clamp-1 overflow-y-auto min-h-[3em]">
                {contributor.roles.map((r) => (<ContributorBadge type={r as ('Founder' | 'Core Team')} key={`${contributor.name}-${r}`} />)) }
            </div>
            <div className="grid grid-cols-3 text-center border-b-2 border-black pb-2 mb-2 gap-1">
                <div className="bg-stripe-yellow p-1 rounded-md">
                    <a href={contributor.profiles.nexusMods ?? '#'} target={contributor.profiles.nexusMods ? '_blank' : undefined}>
                    <Image 
                        src={NexusMods}
                        alt={'Nexus Mods Profile'}
                        width={24}
                        height={24}
                        className={`inline ${!contributor.profiles.nexusMods ? 'grayscale opacity-25' : null}`}
                    />
                    </a>
                </div>
                <div className="bg-stripe-yellow p-1 rounded-md">
                    <a href={contributor.profiles.gitHub ?? '#'} target={contributor.profiles.gitHub ? '_blank' : undefined}>
                    <Image 
                        src={GitHub}
                        alt={'GitHub Profile'}
                        width={24}
                        height={24}
                        className={`inline ${!contributor.profiles.gitHub ? 'grayscale opacity-25' : null}`}
                    />
                    </a>
                </div>
                {contributor.profiles.reddit &&
                <div className="bg-stripe-yellow p-1 rounded-md">
                    <a href={contributor.profiles.reddit ?? '#'} target={contributor.profiles.reddit ? '_blank' : undefined}>
                    <Image 
                        src={Reddit}
                        alt={'Reddit Profile'}
                        width={24}
                        height={24}
                        className={`inline ${!contributor.profiles.reddit ? 'grayscale opacity-25' : null}`}
                    />
                    </a>
                </div>
                }
                {contributor.donateLink && 
                <div className="bg-stripe-yellow p-1 rounded-md">
                    <a href={contributor.donateLink ?? '#'} target={contributor.donateLink ? '_blank' : undefined}>
                    <Icon 
                        path={mdiGift}
                        size={1}
                        className={`inline ${!contributor.donateLink ? 'grayscale opacity-25' : null}`}
                        title='Support'
                    />
                    </a>
                </div>
                }
            </div>
            <div className="text-xs">
                <b>Notable Contributions</b>
                <ul>
                    {contributor.accolades?.map(a => (<li key={a}>{a}</li>))}
                </ul>
            </div>
        </div>
    )
}