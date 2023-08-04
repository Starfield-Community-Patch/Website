'use client'
import { Orbitron } from 'next/font/google'
import BackButton from "@/components/backbutton"
import { mdiArrowLeft } from "@mdi/js"

const orb = Orbitron({ subsets: ['latin'] })

export default function ErrorPage({ error, reset }: { error: Error, reset: () => void }) {


    return (
        <div>
            <h1 className={`text-4xl text-center m-4 `+orb.className}>Failed to load issue</h1>
            <BackButton href='/issues' label="Back to Issue List" icon={mdiArrowLeft} />
            <div className='w-full bg-red-500 text-white text-center py-10 my-4'>
                {error.message}
            </div>
        </div>
    )
}