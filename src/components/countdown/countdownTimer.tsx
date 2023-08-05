'use client'
import { useCountdown } from "@/hooks/useCountdown";
import CountDown from "./counter";

export default function CountDownTimer({ date }: { date: Date | string | number }) {
    const [ days, hours, minutes, seconds ] = useCountdown(date);

    if ((days + hours + minutes + seconds) <= 0) return null;
    else return <CountDown days={days} hours={hours} minutes={minutes} seconds={seconds} />
}