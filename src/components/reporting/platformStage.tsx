import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import { FormEvent } from "react";

export type Platform = 'PC (Xbox)' | 'PC (Steam)' | 'Xbox';

interface IStageProps {
    labels?: IGitHubLabel[]
    next: () => void;
    prev: () => void;
    setPlatform: (platform: IGitHubLabel | undefined) => void;
    platform: IGitHubLabel | undefined;
}

export default function PlatformStage(props: IStageProps) {
    const { labels, next, prev, setPlatform, platform } = props;
    const platformLabels = (props.labels ?? []).filter(l => l.name.startsWith('Platform')).sort((a,b) => a.name.localeCompare(b.name))

    const platformOptions = platformLabels.map(l => (<div key={l.id}><input type='radio' value={l.id} name='platform' checked={l.id === platform?.id} /> {l.name.replace('Platform:', '')}</div>))

    const onChangePlatform = (event: FormEvent<HTMLDivElement>) => setPlatform(labels?.find(l => l.id === (event.target as any).value))

    return (
        <div>
            Platform: {platform?.name}
            <div onChange={onChangePlatform}>
                {platformOptions}
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!platform}>Next</button>
            </div>
        </div>
    )
}