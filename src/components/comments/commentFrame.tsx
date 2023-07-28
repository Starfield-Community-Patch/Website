import { PropsWithChildren } from "react";

interface IFrameProps {
    id: string;
    avatar: JSX.Element | JSX.Element[]
    userName: string;
    profileUrl: string;
    platformIcon: JSX.Element;
    dateComponent?: JSX.Element
}

export default function CommentFrame(props: PropsWithChildren<IFrameProps>) {

    const { id, avatar, userName, profileUrl, platformIcon, children, dateComponent } = props;

    return (
        <div className="w-full grid grid-cols-10 grid-rows-comment p-4" key={`comment-${id}`} id={id}>
        <div className="hidden lg:block col-span-1 row-span-3 p-2">
            {avatar}
        </div>
        <div className="col-span-10 lg:col-span-9 row-span-1 text-right bg-[#2f4dd445] border-2 border-black grid grid-cols-2 p-2 max-h-12">
            <div className="text-left px-2 items-center">
                <b>
                    {userName}
                    <a href={profileUrl}>{platformIcon}</a>
                </b>
            </div>
            {dateComponent}
        </div>
        <div className="col-span-10 lg:col-span-9 row-span-2 border-2 border-black p-2">
            {children}
        </div>
    </div>
    )
}