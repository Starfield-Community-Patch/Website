'use client'
import { Remark } from 'react-remark'
import remarkGfm from "remark-gfm";

export default function IssueBody(props: { body: string }) {
    return (
    <Remark>
        {props.body}
    </Remark>
    )
}