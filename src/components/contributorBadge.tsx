import { mdiStarBox, mdiStarFourPointsCircle, mdiStarFourPointsCircleOutline, mdiToolboxOutline, mdiTranslate } from "@mdi/js";
import Icon from "@mdi/react";

type BadgeType = 'Founder' | 'Core Team' | 'Toolmaker' | 'Translator';

export default function ContributorBadge({ type } : { type: BadgeType }) {
    let color = '#000000';
    let icon = mdiStarBox;

    switch(type) {
        case 'Core Team': {
            color = 'rgb(var(--stripe-orange-rgb))';
            icon = mdiStarFourPointsCircleOutline;
            break;
        }
        case 'Founder': {
            color = 'rgb(var(--stripe-blue-rgb))';
            icon = mdiStarFourPointsCircle;
            break;
        }
        case 'Toolmaker': {
            icon = mdiToolboxOutline;
            break;
        }
        case 'Translator': {
            icon = mdiTranslate;
            break;
        }
    }

    if (!color || !icon) return null;

    return (
        <span className="px-1 py-0.5 mr-1 my-1 border-2 inline-block rounded-md align-middle items-center" style={{borderColor: color, color}}>
            <Icon path={icon} size={0.75} className="inline" /> {type}
        </span>
    )


}