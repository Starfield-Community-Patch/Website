'use client'

interface IErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error(props: IErrorProps) {
    return (
        <div>Error building issue list table! {props.error.message}</div>
    )
}