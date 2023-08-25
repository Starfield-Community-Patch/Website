import { Orbitron } from "next/font/google";

interface IProps {
    children: React.ReactNode;
    changeList: React.ReactNode;
}

const orb = Orbitron({ subsets: ['latin'] })

export default function Layout(props: IProps) {
    return (
        <>
            <h1 className={orb.className}>Changelog</h1>
            {props.children}
            {props.changeList}
        </>
    )
}