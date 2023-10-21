import { Orbitron } from 'next/font/google'
import UserAvatar from '@/components/useravatar'
import { getSingleIssue } from "@/util/GitHub/issue";
import BackButton from "@/components/backbutton";
import { mdiArrowLeft, mdiCreation, mdiUpdate } from '@mdi/js';
import StatusLabel from '@/components/statusLabel';
import RelativeDate from '@/components/relativeDate';
import IssueBody from '@/components/issueBody';
import GitHub from '../../../components/sidebar/github-mark.svg'
import Image from 'next/image';
import { Metadata, ResolvingMetadata } from 'next'
import IssueLabel from '@/components/issueLabel';
import CommentContainer from '@/components/comments/commentContainer';

const orb = Orbitron({ subsets: ['latin'] })

interface IIssueViewProps {
    params: {
        id: string
    }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: IIssueViewProps, parent: ResolvingMetadata): Promise<Metadata> {
    const id = parseInt(params.id);
    if (isNaN(id)) return { title: 'Error!' };

    try {
        const req = await getSingleIssue(id);
        const issue = req.data?.repository.issue;
        const trimmedBody = issue?.body.substring(0, 200);
        return ({
            title: `${issue?.title} - Issue #${id}`,
            description: `Issue #${id} - ${issue?.title}\n${trimmedBody}${(trimmedBody?.length ?? 0) < (issue?.body.length ?? 0) ? '...' : ''}}`,
        })
    }
    catch(err) {
        if ((err as any).code === 'ERR_INVALID_URL') {
            console.log('Invalid URL error', (err as any).input)
        }
        else console.log('Error fetching metadata', err);
        return {
            title: `Issue #${id} - Unknown`,
            description: `Issue #${id} - We couldn't find this issue, but you might be able to!`,
        }
    }
}

export default async function IssueView(props: IIssueViewProps) {
    const { params } = props;

    const getIssue = async (id: number) => {
        try {
            if (isNaN(id)) throw new Error(`Issue ID "${params.id}" is not a valid number`)
            const req = await getSingleIssue(id);
            return req
        }
        catch(err) {
            throw err
        }
    }
    const issueId: number = parseInt(params.id);
    let issue;
    
    const req = await getIssue(issueId)
    issue = req?.data?.repository.issue


    return (
        <div>
            <h1 className={orb.className}>Issue #{props.params.id}</h1>
            <BackButton href='/issues' label="Back to Issue List" icon={mdiArrowLeft} />
            <h2 className={`mt-4 `+orb.className}>{issue?.title}</h2>
            <div className="grid grid-flow-row grid-cols-3 mb-2 gap-1 lg:gap-4 border-2 border-black py-2 px-8 bg-[#2f4dd445]">
                <div className='flex items-center'><StatusLabel label={issue?.state!}/></div>
                <div>
                    <a href={issue?.NexusMods ? `https://nexusmods.com/users/${issue.NexusMods.memberId}` : `https://github.com/${issue?.author.login}`}>
                        <div className='flex flex-row align-middle gap-2 content-center items-center text-center'>
                            <div className='hidden lg:flex'>Reporter: </div>
                            <UserAvatar nexusMods={issue?.NexusMods} githubUser={issue?.author} /> 
                            <div className='hidden lg:flex'>{issue?.NexusMods?.name ?? issue?.author.login}</div>
                        </div>
                    </a>
                </div>
                <div className='flex items-center'><RelativeDate date={issue?.createdAt ?? 0} icon={mdiCreation} label={'Created'} /></div>
            </div>
            <div className={`[&>h2]:mt-4 [&>h2]:mb-0.5 [&>h2]:font-orbitron border-2 border-black py-2 px-8`}>
            <IssueBody body={issue?.body !== "" ? issue?.body! : '*No issue description provided.*'} />
            { 
            (issue?.labels.nodes ?? []).length 
            ? <div className='my-2 border-t-2 pt-2'>{(issue?.labels.nodes ?? []).map((l) => <IssueLabel label={l} key={l.id} />)}</div> 
            : null
            }
            </div>
            <div className="grid grid-flow-row grid-cols-3 mt-2 gap-4 border-2 border-black py-2 px-8 bg-[#2f4dd445] items-center">
                <div>
                    <a href={issue?.url} target='_blank'>
                        <Image 
                            src={GitHub}
                            width={18}
                            height={18}
                            alt='GitHub Logo'
                            title='View on GitHub'
                            className='inline mr-2'
                        />
                        GitHub ↗
                    </a>
                </div>
                <div className='col-start-3'><RelativeDate date={issue?.updatedAt ?? 0} icon={mdiUpdate} label={'Updated'} /></div>
            </div>
            <h2 id='comments' className={`mt-4 `+orb.className}>Comments ({issue?.comments?.totalCount ?? 0})</h2>
            <CommentContainer id={issue?.id!} number={issueId}  />
        </div>
    )
}