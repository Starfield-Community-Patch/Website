import { Orbitron } from "next/font/google";

interface IProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const orb = Orbitron({ subsets: ['latin'] })

export default function CountDown(props: IProps) {
    const { days, hours, minutes, seconds } = props;

    return (
        <div className="grid grid-cols-7 m-4 p-4 border-2 border-black text-center text-3xl">   
            <CountDownDisplay value={days} type={'Days'} isDanger={days <= 3} />
            <p>:</p>
            <CountDownDisplay value={hours} type={'Hours'} isDanger={days <= 3} />
            <p>:</p>
            <CountDownDisplay value={minutes} type={'Minutes'} isDanger={days <= 3} />
            <p>:</p>
            <CountDownDisplay value={seconds} type={'Seconds'} isDanger={days <= 3} />
        </div>
    )
}

function CountDownDisplay({ value, type, isDanger }: { value: number, type: string, isDanger: boolean }) {

    const paddedValue = value.toString().length === 1 ? `0${value}` : value.toString()

    return (
        <div className="text-5xl">
            <div className={`${isDanger ? 'text-red-500' : ''} ${orb.className} font-bold`}>
                {paddedValue}
            </div>
            <div className="text-lg">
                {type}
            </div>
        </div>
    )

}