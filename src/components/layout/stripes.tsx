interface IStripeProps {
    className?: string | undefined
}

export default function Stripes(props: IStripeProps) {
    return (
        <div className={`bg-starfield-stripes h-[80px] ${props.className}`} />
    )
} 