import BackButton from "@/components/backbutton";
import { mdiArrowLeft } from "@mdi/js";
import { Orbitron } from 'next/font/google'
import Image from "next/image";
import GitHub from '../../../components/sidebar/github-mark.svg'
import CommentLoader from "@/components/commentskeleton";

const orb = Orbitron({ subsets: ['latin'] })

export default function LoadingIssue() {
    return (
        <div>
            <h1 className={orb.className}>Issue #</h1>
            <BackButton href='/issues' label="Back to Issue List" icon={mdiArrowLeft} />
            <div className='animate-pulse my-2'><div className='w-1/3 h-8 opacity-50 bg-gray-500 rounded' /></div>
            <div className="grid grid-flow-row grid-cols-3 mb-2 gap-1 lg:gap-4 border-2 border-black py-2 px-8 bg-[#2f4dd445]">
                <div className='flex items-center animate-pulse'><div className='w-16 h-6 opacity-50 bg-gray-500 rounded' /></div>
                <div>
                        <div className='flex flex-row align-middle gap-2 content-center items-center text-center animate-pulse'>
                            <div className='hidden lg:flex'>Reporter: </div>
                            <div className='w-8 h-8 opacity-50 bg-gray-500 rounded-full inline-block'/>
                            <div className='hidden lg:flex'><div className='w-16 h-4 opacity-50 bg-gray-500 rounded inline object-center' /></div>
                        </div>
                </div>
                <div className='flex items-center animate-pulse'><div className='w-16 h-4 opacity-50 bg-gray-500 rounded inline object-center' /></div>
            </div>
            <div className='border-2 border-black py-2 px-8 animate-pulse'>
            <div className="my-4"><div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded'/></div>
            <hr />
            <div className="my-4">
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
            </div>
            <div className="my-4">
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
            </div>
            <div className="my-4">
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
                <div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded my-1'/>
            </div>
            </div>
            <div className="grid grid-flow-row grid-cols-3 mt-2 gap-4 border-2 border-black py-2 px-8 bg-[#2f4dd445] items-center">
                <div>
                    <Image
                            src={GitHub}
                            width={18}
                            height={18}
                            alt='GitHub Logo'
                            title='View on GitHub'
                            className='inline mr-2'
                        />
                        GitHub ↗
                </div>
                <div className='col-start-3 animate-pulse'><div className='w-16 h-4 opacity-50 bg-gray-500 rounded inline-block object-center' /></div>
            </div>
            <h2 id='comments' className={`mt-4 `+orb.className}>Comments (0)</h2>
            <CommentLoader />
            <CommentLoader />
            <CommentLoader />
            <CommentLoader />
            <CommentLoader />
            <hr />
            <CommentLoader />
        </div>
    );
}