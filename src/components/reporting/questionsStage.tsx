import { Orbitron } from "next/font/google";
import VASCOTip from "./vascotip";
import { ChangeEvent } from "react";

const orb = Orbitron({ subsets: ['latin'] })

interface IStageProps {
    next: () => void;
    prev: () => void;
    setBody: (newBody: any) => void;
    body: any;
}

export default function QuestionStage(props: IStageProps) {
    const { next, prev, body, setBody } = props;
    
    const isBodyComplete = () => true

    const updateQuestion = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, q: string) => {
        const newBody = {...body};
        if (!newBody.questions) newBody.questions = {}
        newBody.questions[q] = { title: q, answer: e.target.value };
        setBody(newBody)
    }

    const updateSummary = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newBody = {...body};
        newBody.summary = e.target.value;
        setBody(newBody)
    }

    return (
        <div>
            <div>
                <div className="my-4">
                <h2 className={orb.className}>Summary</h2>
                <textarea rows={3} className="w-full mx-auto p-1" onChange={updateSummary} />
                </div>
                <hr />
                <div  className="my-4">
                <h2 className={orb.className}>Game Version</h2>
                <input type='text' placeholder="e.g. 1.10.0" className="mx-auto p-1" onChange={(e) => updateQuestion(e, 'Game Version')} />
                <VASCOTip side='right'>
                    You can learn how to find your game version here.
                </VASCOTip>
                </div>
                <hr/>
                <div  className="my-4">
                <h2 className={orb.className}>Reproduction Steps</h2>
                <textarea rows={5} className="w-full mx-auto p-1" onChange={(e) => updateQuestion(e, 'Reproduction Steps')} />
                </div>
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!isBodyComplete()}>Next</button>
            </div>
            <pre>{JSON.stringify(body, null, 2)}</pre>
        </div>
    )
}