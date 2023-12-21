'use client'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import ReactMarkdown from 'react-markdown'

const removeComments: () => undefined = require('remark-remove-comments').default;

export default function IssueBody(props: { body: string }) {
    const repository = `${process.env.GITHUB_OWNER}/${process.env.GITHUB_NAME}`
    // remarkGithub({ repository })

    return (
    <ReactMarkdown remarkPlugins={[removeComments, remarkGfm]}>
        {props.body}
    </ReactMarkdown>
    )
}