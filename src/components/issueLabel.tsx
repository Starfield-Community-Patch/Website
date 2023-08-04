import { IGitHubLabel } from "@/util/GitHub/get-repo-labels";

interface ILabelProps {
    label: IGitHubLabel
    size?: 'small'
}

export default function IssueLabel(props: ILabelProps) {
    const { label, size } = props;
    const sizeClass = size === 'small' ? 'text-xs' : 'text-sm'

    const customColor = `#${label.color}`
    return (
    <div title={label.description} className={`px-2 py-0.5 mr-1 my-1 border-2 inline-block rounded-md ${sizeClass}`} style={{borderColor: customColor, color: customColor}} key={label.id}>
        {label.name}
    </div>
    );
}