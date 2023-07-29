import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import { FormEvent } from "react";

interface IStageProps {
    labels?: IGitHubLabel[]
    next: () => void;
    prev: () => void;
    setType: (platform: IGitHubLabel | undefined) => void;
    type: IGitHubLabel | undefined;
}

export default function TypeStage(props: IStageProps) {
    const { labels, next, prev, setType, type } = props;
    const platformLabels = (props.labels ?? []).filter(l => l.name.startsWith('Type: ')).sort((a,b) => a.name.localeCompare(b.name))

    const labelOption = (l: IGitHubLabel) => (
        <div key={l.id}>
            <label>
            <input type='radio' value={l.id} name='platform' checked={l.id === type?.id} /> 
            {l.name.replace('Type: ', '')} - <span className="text-slate-500">{l.description}</span>
            </label>
        </div>
    )
    const platformOptions = platformLabels.map(labelOption)

    const onChangePlatform = (event: FormEvent<HTMLDivElement>) => setType(labels?.find(l => l.id === (event.target as any).value))

    return (
        <div>
            <div onChange={onChangePlatform}>
                {platformOptions}
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!type}>Next</button>
            </div>
        </div>
    )
}