import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import { ChangeEvent, FormEvent } from "react";

export type Platform = 'PC (Xbox)' | 'PC (Steam)' | 'Xbox';

interface IStageProps {
    labels?: IGitHubLabel[]
    next: () => void;
    prev: () => void;
    setPlatform: (platform: IGitHubLabel | undefined) => void;
    platform: IGitHubLabel | undefined;
    setDlcs: (dlc: Set<IGitHubLabel>) => void;
    dlcs: Set<IGitHubLabel>
}

export default function PlatformStage(props: IStageProps) {
    const { labels, next, prev, setPlatform, platform, dlcs, setDlcs } = props;
    const platformLabels = (labels ?? []).filter(l => l.name.startsWith('Platform')).sort((a,b) => a.name.localeCompare(b.name))
    const dlcLabels = (labels ?? []).filter(l => l.name.startsWith('DLC')).sort((a,b) => a.name.localeCompare(b.name))

    const toggleDlcs = (event: ChangeEvent<HTMLInputElement>) => {
        const dlc = labels?.find(l => l.id === (event.target as any).value)
        if (!dlc) return console.error('Unknwon DLC', event);
        const newDlcs = new Set([...dlcs]);
        event.target.checked ? newDlcs.add(dlc) :newDlcs.delete(dlc)
        setDlcs(newDlcs)
    }

    const platformOptions = platformLabels.map(l => (<div key={l.id}><input type='radio' value={l.id} name='platform' checked={l.id === platform?.id} /> {l.name.replace('Platform:', '')}</div>))
    const dlcOptions = dlcLabels.map(d => (<div key={d.id}><input type='checkbox' value={d.id} checked={dlcs.has(d)} onChange={toggleDlcs} /> {d.name.replace('DLC:', '')}</div>))

    const onChangePlatform = (event: FormEvent<HTMLDivElement>) => setPlatform(labels?.find(l => l.id === (event.target as any).value))

    return (
        <div>
            Platform: {platform?.name}
            <div onChange={onChangePlatform}>
                {platformOptions}
            </div>
            DLCs {[...dlcs].map(d => d.name)}
            <div>
                {dlcOptions}
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!platform}>Next</button>
            </div>
        </div>
    )
}