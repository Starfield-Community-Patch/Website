'use client'

import Icon from "@mdi/react";

interface IProps {
    date: Date | string | number;
    icon: string;
    label: string;
}

const timeAgo = (prevDate: number) => {
    const diff = Number(new Date()) - prevDate;
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    switch (true) {
        case diff < minute:
            const seconds = Math.round(diff / 1000);
             return `${seconds} ${seconds > 1 ? 'seconds' : 'second'} ago`
        case diff < hour:
            const m = Math.round(diff / minute)
            return `${m} ${m > 1 ? 'minutes' : 'minute'} ago`
        case diff < day:
            const h = Math.round(diff / hour)
            return `${h} ${h > 1 ? 'hours' : 'hour'} ago`
        case diff < month:
            const d = Math.round(diff / day)
            return `${d} ${d > 1 ? 'days' : 'day'} ago`
        case diff < year:
            const mon = Math.round(diff / month)
            return `${mon} ${mon > 1 ? 'months' : 'month'} ago`
        case diff > year:
            const y = Math.round(diff / year)
            return `${y} ${y > 1 ? 'years' : 'year'} ago`
        default:
            return "";
    }
};

export default function RelativeDate(props: IProps) {
    const date = ['string', 'number'].includes(typeof(props.date)) 
        ? new Date(props.date)
        : (props.date as Date)
    
    const ms = date.getTime();

    return (
        <span title={`${props.label} ${date.toLocaleString()}`}>
            <Icon path={props.icon} size={1} className="inline" /> {timeAgo(ms)}
        </span>
    )


}