import { IGitHubCommentsResponse } from "@/util/GitHub/issue-comments";
import { useState } from "react";
import useSWR from "swr";

const fetchComments = async (url: string, offset: IGitHubCommentOffsets | undefined) => {
    let reqUrl = url;

    if (!!offset) {
        const params = new URLSearchParams()
        if (offset.after) params.append('after', offset.after);
        else if (offset.before) params.append('before', offset.before);
        reqUrl = `${reqUrl}&${params.toString()}`

    }
    // console.log('Requesting comments with offsets', {offset, url: reqUrl})

    const request = await fetch(reqUrl)
    if (request.ok) {
        const response: IGitHubCommentsResponse = await request.json();
        return { 
            total: response.data?.repository.issue.comments.totalCount ?? 0,
            comments: response.data?.repository.issue.comments.nodes ?? [], 
            pageInfo: response.data?.repository.issue.comments.pageInfo ?? undefined
        }
    }
    else {
        console.error('Error getting comment info', { status: request.status, text: request.statusText })
        return {
            total: 0,
            comments: [],
            pageInfo: undefined
        }
    }
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?:never };
type OR<T, U> = (T | U ) extends object ? (Without<T,U> & U) | (Without<U,T> & T) : T | U;


type IGitHubCommentOffsets = OR<{ before: string }, { after: string }>;


export default function useComments(number: number, id: string) {

    const [offset, saveOffset] = useState<IGitHubCommentOffsets | undefined>(undefined);

    const { data: { comments, pageInfo, total }, mutate } = useSWR(
        `/api/comments?id=${number}`,
        (url) => fetchComments(url, offset),
        { fallbackData: { comments: [], pageInfo: undefined, total: 0 } }
    );

    const onSubmit = async (comment: string) => {
        try {
            const form = new FormData();
            form.append('comment', comment)
            const params = new URLSearchParams()
            params.append('issue_id', id)
            params.append('issue_number', number.toString())
            const post = await fetch(`/api/comments/add?${params.toString()}`, { method: 'POST', body: form });
            if (!post.ok) {
                console.warn('Network error', {code: post.status, msg: post.statusText ?? 'No message!'})
                throw new Error(post.statusText ?? post.status)
            }
            await mutate()
        }
        catch(err) {
            console.log('Error submitting comment', err)
            throw err;
        }
    }

    const setOffset = async (value: IGitHubCommentOffsets | undefined) => {
        saveOffset(value);
        // For some reason updating the state value takes a few ms to apply. 
        setTimeout(async () => await mutate(), 200)
    }

    return { comments, total, onSubmit, pageInfo, offset, setOffset}
}