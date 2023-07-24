interface IProps {
    label: 'OPEN' | 'CLOSED';
}

export default function StatusLabel(props: IProps) {
    if (props.label === 'OPEN') return (
        <div className="px-2 py-0.5 bg-stripe-blue inline rounded-md text-white">
            {props.label}
        </div>
    )
    else if (props.label === 'CLOSED') return (
        <div className="px-2 py-0.5 bg-stripe-red inline rounded-md text-white">
            {props.label}
        </div>
    )
    else return (
        <div className="px-2 py-0.5 bg-green-500 inline rounded-md text-white">
            {props.label}
        </div>
    )
}