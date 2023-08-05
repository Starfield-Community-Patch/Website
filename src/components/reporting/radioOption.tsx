'use client'

import { IGitHubLabel } from "@/util/GitHub/get-repo-labels"

interface IProps {
    option: IGitHubLabel
    allOptions: IGitHubLabel[]
    setCb: (v: IGitHubLabel | undefined) => void;
    selected?: IGitHubLabel
    name: string;
}

export default function RadioButtonOption(props: IProps) {
    const { option: l, allOptions: labels, setCb, selected: type, name } = props;

    return (
        <div 
            key={l.id} 
            className="issue-report-option grid lg:grid-cols-[10%_90%] grid-cols-[20%_80%] lg:grid-rows-2 grid-rows-[minmax(0,_1.5rem)_minmax(0,_1fr)] hover:bg-[#2f4dd445]"
            onClick={() => setCb(labels.find(la => la.id === l.id))}
        >
            <div className="row-span-2">
                <input type='radio' value={l.id} name='type' checked={l.id === type?.id} onChange={() => setCb(labels.find(la => la.id === l.id))} /> 
            </div>
            <div className="max-h-4">
                {name}
            </div>
            <div className="col-start-2">
                <span className="text-slate-500">{l.description}</span>
            </div>
        </div>
    )
}