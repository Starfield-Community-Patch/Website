import { Orbitron } from 'next/font/google'
import UserAvatar from '@/components/useravatar'
import { getSingleIssue } from "@/util/GitHub/issue";
import BackButton from "@/components/backbutton";
import { mdiArrowLeft, mdiCreation, mdiUpdate } from '@mdi/js';
import StatusLabel from '@/components/statusLabel';
import RelativeDate from '@/components/relativeDate';
import IssueBody from '@/components/issueBody';
import IssueComments from '@/components/comments/issueComments';
import GitHub from '../../../components/sidebar/github-mark.svg'
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import OAuthProviders from '@/util/auth/oauth';
import { Metadata, ResolvingMetadata } from 'next'
import CommentInput from '@/components/comments/commentInput';

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
        return ({
            title: `${issue?.title} - Issue #${id} - Starfield Community Patch`
        })
    }
    catch(err) {
        if ((err as any).code === 'ERR_INVALID_URL') {
            console.log('Invalid URL error', (err as any).input)
        }
        else console.log('Error fetching metadata', err);
        return { title: `Issue #${id} - Starfield Community Patch` }
    }
}

export default async function IssueView(props: IIssueViewProps) {
    const session = await getServerSession(OAuthProviders);

    const getIssue = async (id: number) => {
        try {
            if (isNaN(id)) throw new Error(`Issue ID "${id}" is not a valid number`)
            const req = await getSingleIssue(id);
            return req
        }
        catch(err) {
            throw err
        }
    }
    const { params } = props;
    const issueId: number = parseInt(params.id);
    let issue;
    try {
        const req = await getIssue(issueId)
        issue = req?.data?.repository.issue
    }
    catch(err) {
        console.error('Failed to fetch issue', err);
        return (
        <div>
            <h1 className={`text-4xl text-center m-4 `+orb.className}>Issue #{props.params.id}</h1>
            <BackButton href='/issues' label="Back to Issue List" icon={mdiArrowLeft} />
            <div className='w-full bg-red-500 text-white text-center py-10'>
                Error: {(err as Error).message}
            </div>
        </div>
        )
    }

    const label = (l: { id: string, name: string, color:string}) => {
        const customColor = `#${l.color}`
        return (
        <div className={`px-2 py-0.5 mr-1 my-1 border-2 inline-block rounded-md text-sm`} style={{borderColor: customColor, color: customColor}} key={l.id}>
            {l.name}
        </div>
        );
    }

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
            <div className='border-2 border-black py-2 px-8'>
            <IssueBody body={issue?.body !== "" ? issue?.body! : '*No issue description provided.*'} />
            { (issue?.labels.nodes ?? []).length ? <div className='my-2 border-t-2 pt-2'>{(issue?.labels.nodes ?? []).map(label)}</div> : null}
            </div>
            <div className="grid grid-flow-row grid-cols-3 mt-2 gap-4 border-2 border-black py-2 px-8 bg-[#2f4dd445] items-center">
                <div>
                    <a href={issue?.url}>
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
            <IssueComments id={issueId} />
            <hr />
            <CommentInput commentId={issue?.id} />
        </div>
    )
}