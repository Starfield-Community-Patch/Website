const suffixes = {
    long: {
        sec: [' seconds', ' second'],
        min: [' minutes', ' minute'],
        hr: [' hours', ' hour'],
        day: [' days', ' day'],
        mnth: [' months', ' month'],
        yr: [' years', ' years']
    }, 
    short: {
        sec: ['s', 's'],
        min: ['m', 'm'],
        hr: ['h', 'h'],
        day: ['d', 'd'],
        mnth: ['mth', 'mths'],
        yr: ['yrs', 'yr']        
    }
}

const timeAgo = (prevDate: number, format: 'long' | 'short') => {
    const diff = Number(new Date()) - prevDate;
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    let units = [];

    switch (true) {
        case diff < minute:
            const seconds = Math.round(diff / 1000);
            units = suffixes[format].sec
            return `${seconds}${seconds > 1 ? units[0] : units[1]} ago`
        case diff < hour:
            const m = Math.round(diff / minute)
            units = suffixes[format].min
            return `${m}${m > 1 ? units[0] : units[1]} ago`
        case diff < day:
            const h = Math.round(diff / hour)
            units = suffixes[format].hr
            return `${h}${h > 1 ? units[0] : units[1]} ago`
        case diff < month:
            const d = Math.round(diff / day)
            units = suffixes[format].day
            return `${d}${d > 1 ? units[0] : units[1]} ago`
        case diff < year:
            const mon = Math.round(diff / month)
            units = suffixes[format].mnth
            return `${mon}${mon > 1 ? units[0] : units[1]} ago`
        case diff > year:
            const y = Math.round(diff / year)
            units = suffixes[format].yr
            return `${y}${y > 1 ? units[0] : units[1]} ago`
        default:
            return "";
    }
};

export default function RelativeDateText({ date, format }: { date: Date | string | number, format: 'long' | 'short' | undefined }) {
    const style = format ?? 'long';
    const d = ['string', 'number'].includes(typeof(date)) 
        ? new Date(date)
        : (date as Date)
    
    const ms = d.getTime();

    return timeAgo(ms, style);
}