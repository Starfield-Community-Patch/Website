'use client'

interface IErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: IErrorProps) {
    return (
    <div>
        <p>Error! {error.message}</p>
        <button onClick={() => reset()}>Retry</button>
    </div>
    )
}