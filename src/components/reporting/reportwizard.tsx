'use client'

import { IGitHubLabel, IGitHubRepoResponse } from '@/util/GitHub/get-repo-labels';
import { useState } from 'react';
import StartStage from './startStage';
import PlatformStage from './platformStage';
import TypeStage from './typeStage';
import QuestionStage from './questionsStage';
import ReviewStage from './reviewStage';
import { useSession, signIn } from 'next-auth/react';

type ReportStage = 'start' | 'platform' | 'type' | 'questions' | 'review';

export interface IReportBody {
    title? : string;
    summary?: string;
    details?: string;
    questions?: {
        [key: string] : {
            title: string;
            answer: string;
            priority: number;
        }
    }
}

const defaultBody: IReportBody = {
    questions: {
        "Game Version": {
            title: 'Game Version',
            answer: '1.8.86.0',
            priority: 10
        }
    }
}

const stages: ReportStage[] = ['start' , 'platform' , 'type' , 'questions' , 'review']

export default function ReportWizard(props: { repo: IGitHubRepoResponse }) {
    const { repo } = props;
    const {status} = useSession()
    const [ platform, setPlatform ] = useState<IGitHubLabel | undefined>(undefined);
    const [ type, setType ] = useState<IGitHubLabel | undefined>(undefined);
    const [ stage, setStage ] = useState<ReportStage>('start');
    const [ body, setBody ] = useState<IReportBody>(defaultBody);
    const [ dlcs, setDlcs ] = useState<Set<IGitHubLabel>>(new Set())

    const nextStage = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (status !== 'authenticated') return signIn('nexusmods', { redirect: false })
        const cur = stages.indexOf(stage);
        if (cur !== -1) setStage(stages[cur+1])
    }

    const prevStage = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const cur = stages.indexOf(stage);
        if (cur > 0 && cur !== -1) setStage(stages[cur-1])
    }

    const updatePlatform = (val: IGitHubLabel | undefined) => setPlatform(val);
    const updateType = (val: IGitHubLabel | undefined) => setType(val);
    const updateDlcs = (val: Set<IGitHubLabel>) => setDlcs(val);

    
    const env: 'development' | 'production' | 'test' = process.env.NODE_ENV;

    // if (env === 'production') return <p>Not available yet!</p>

    const unknownStage = (
    <div>
        Unknown report stage: {stage}
        <button onClick={() => setStage('start')}>Restart</button>
    </div>
    );

    let page;

    switch(stage) {
        case 'start': {
            page = <StartStage next={nextStage} status={status} />
            break;
        }
        case 'platform': {
            page = <PlatformStage next={nextStage} prev={prevStage} setPlatform={updatePlatform} labels={repo.data?.repository.labels.nodes} platform={platform} dlcs={dlcs} setDlcs={updateDlcs} />
            break;
        }
        case 'type' : {
            page = <TypeStage next={nextStage} prev={prevStage} setType={updateType} labels={repo.data?.repository.labels.nodes} type={type} />
            break;
        }
        case 'questions' : {
            page = <QuestionStage next={nextStage} prev={prevStage} body={body} setBody={setBody} />
            break;
        }
        case 'review' : {
            page = <ReviewStage prev={prevStage} body={body} typeLabel={type} platformLabel={platform} dlcLabels={dlcs} repoId={repo.data?.repository.id!} />
            break;
        }
        default: {
            page = unknownStage
            break;
        }
    }

    return (
        <div className='border-2 border-black p-4'>
            {page}
        </div>
        
    )
}