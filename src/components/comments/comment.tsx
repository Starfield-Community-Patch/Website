import { IGitHubComment } from "@/util/GitHub/issue-comments";
import RelativeDate from "../relativeDate";
import { mdiUpdate } from "@mdi/js";
import UserAvatar from "../useravatar";
import GitHub from '../sidebar/github-mark.svg';
import NexusMods from '../sidebar/Nexus Icon.svg';
import Image from "next/image";
import IssueBody from "../issueBody";


export default function IssueComment(props: { comment: IGitHubComment }) {
    const { comment } = props;

    const nexusProfile = !!comment.NexusMods
    const profileUrl = comment.NexusMods ? `https://nexusmods.com/users/${comment.NexusMods.memberId}` : `https://github.com/${comment.author.login}`;

    return (
    <div className="w-full grid grid-cols-10 grid-rows-3 p-4" key={`comment-${comment.id}`} id={comment.id}>
        <div className="hidden lg:block col-span-1 row-span-3 p-2">
            <UserAvatar nexusMods={comment.NexusMods} githubUser={comment.author} size={48} />
        </div>
        <div className="col-span-10 lg:col-span-9 row-span-1 text-right bg-[#2f4dd445] border-2 border-black grid grid-cols-2 p-2">
            <div className="text-left px-2 items-center">
                <b>
                    {comment.NexusMods?.name ?? comment.author.login}
                    <a href={profileUrl}><Image src={nexusProfile ? NexusMods : GitHub} width={18} height={18} alt={'Profile platform'} className="inline ml-2" /></a>
                </b>
            </div>
            <RelativeDate date={comment.createdAt} icon={mdiUpdate} label='Created At' />
        </div>
        <div className="col-span-10 lg:col-span-9 row-span-2 border-2 border-black p-2">
            <IssueBody body={comment.body} />
        </div>
    </div>
    );
}