export default function Layout(props: {
    children: React.ReactNode,
    table: React.ReactNode
}) {
    return (
        <>
            {props.children}
            {props.table}
        </>
    )
}