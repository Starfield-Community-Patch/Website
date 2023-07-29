'use client'

import { IGitHubLabel, IGitHubRepoResponse } from '@/util/GitHub/get-repo-labels';
import { useState } from 'react';
import StartStage from './startStage';
import PlatformStage, { Platform } from './platformStage';
import TypeStage from './typeStage';
import QuestionStage from './questionsStage';

type ReportStage = 'start' | 'platform' | 'type' | 'questions' | 'review' | 'complete';

interface IReportBody {
    summary?: string;
    questions?: {
        title: string;
        answer: string;
    }[]
}

const stages: ReportStage[] = ['start' , 'platform' , 'type' , 'questions' , 'review' , 'complete']

export default function ReportWizard(props: { repo: IGitHubRepoResponse }) {
    const { repo } = props;
    const [ platform, setPlatform ] = useState<IGitHubLabel | undefined>(undefined);
    const [ type, setType ] = useState<IGitHubLabel | undefined>(undefined);
    const [ stage, setStage ] = useState<ReportStage>('start');
    const [ body, setBody ] = useState<IReportBody>({});

    const nextStage = () => {
        const cur = stages.indexOf(stage);
        if (cur !== -1) setStage(stages[cur+1])
    }

    const prevStage = () => {
        const cur = stages.indexOf(stage);
        if (cur > 0 && cur !== -1) setStage(stages[cur-1])
    }

    const updatePlatform = (val: IGitHubLabel | undefined) => setPlatform(val);
    const updateType = (val: IGitHubLabel | undefined) => setType(val);

    
    const env: 'development' | 'production' | 'test' = process.env.NODE_ENV;

    if (env === 'production') return <p>Not available yet!</p>

    const unknownStage = (
    <div>
        Unknown report stage: {stage}
        <button onClick={() => setStage('start')}>Restart</button>
    </div>
    );

    let page;

    switch(stage) {
        case 'start': {
            page = <StartStage next={nextStage} />
            break;
        }
        case 'platform': {
            page = <PlatformStage next={nextStage} prev={prevStage} setPlatform={updatePlatform} labels={repo.data?.repository.labels.nodes} platform={platform} />
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
            page = unknownStage
            break;
        }
        case 'complete' : {
            page = unknownStage
            break;
        }
        default: {
            page = unknownStage
            break;
        }
    }

    return (
        <div>
            {page}
        </div>
    )
}