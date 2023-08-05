import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";
import { Orbitron } from "next/font/google";
import { FormEvent } from "react";
import RadioButtonOption from "./radioOption";

const orb = Orbitron({ subsets: ['latin'] })

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
    const typeOptions = platformLabels.map((label) => (<RadioButtonOption name={label.name.replace('Type: ', '')} key={label.id} option={label} allOptions={labels ?? []} selected={type} setCb={setType} />))

    const onChangeType = (event: FormEvent<HTMLDivElement>) => setType(labels?.find(l => l.id === (event.target as any).value))

    return (
        <div>
            <h2 className={orb.className}>Which category represents the issue you are reporting?</h2>
            <p>If your issue falls into more than one category, pick the one you feel is most revelant.</p>
            <div onChange={onChangeType}>
                {typeOptions}
            </div>
            <div className="flex flex-row justify-between my-2 mx-4 border-t-2 border-black pt-4">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!type}>Next</button>
            </div>
        </div>
    )
}