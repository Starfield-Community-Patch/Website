import { Orbitron } from "next/font/google";
import { FormEvent } from "react";
import VASCOTip from "./vascotip";

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

    return (
        <div>
            <div>
                <div className="my-4">
                <h2 className={orb.className}>Summary</h2>
                <input type='text' className="w-full" />
                </div>
                <hr />
                <div  className="my-4">
                <h2 className={orb.className}>Game Version</h2>
                <input type='text' />
                <VASCOTip side='right'>
                    You can learn how to find your game version here.
                </VASCOTip>
                </div>
                <hr/>
            </div>
            <div className="flex flex-row justify-between my-2 mx-8">
                <button className="secondary" onClick={prev}>Back</button>
                <button onClick={next} disabled={!isBodyComplete()}>Next</button>
            </div>
        </div>
    )
}