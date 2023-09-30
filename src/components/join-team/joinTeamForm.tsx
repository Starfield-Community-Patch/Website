"use client"

import { ChangeEvent, Suspense, useCallback, useRef, useState } from "react";
import { GitHubTeam } from "@/util/GitHub/common";

interface IProps {
    teams: GitHubTeam[];
    org: string;
}


export default function JoinTeamForm(props: IProps) {
    const { teams } = props;

    const formRef = useRef<HTMLFormElement>(null);

    const [formIsValid, setFormValid] = useState<boolean>(false);
    const [selectedTeams, setSelectedTeams] = useState<GitHubTeam[]>([]);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number|null>(null);
    const [statusText, setStatusText] = useState<string>('');

    const hasTeamsSelected = selectedTeams.length > 0;

    const toggleTeam = (team: GitHubTeam) => {
        const selected = !!selectedTeams.find(t => t.id === team.id);
        if (selected) setSelectedTeams(selectedTeams.filter(t => t.id !== team.id))
        else setSelectedTeams([team, ...selectedTeams]);
    }

    const teamSelector = (team: GitHubTeam) => {
        const selected = selectedTeams.includes(team);
        return <li className='block mb-2'><label className='flex items-center gap-3'>
            <input type='checkbox' name='teams[]' value={selected ? team.id : 'unselected'} checked={selected} onChange={() => toggleTeam(team)} />
            <div className='block'>
                <h3>{team.name}</h3>
                <p>{team.description}</p>
            </div>
        </label></li>
    }

    // HTMLFormElement.reportValidity() reports errors to the user; HTMLFormElement.checkValidity() does not.


    const submit = useCallback(async () => {
        const form = formRef.current;
        if (!form || !formIsValid || !hasTeamsSelected || !form.reportValidity()) return;

        const data = new FormData(form);

        const resPromise = fetch(`/api/join?org=${encodeURIComponent(props.org || 'NONE')}`, {
            method: 'POST',
            body: data
        });

        setSubmitting(true);

        try {
            const result = await resPromise
            setSubmitting(false);
            setStatusCode(result.status);
            setStatusText(result.statusText);
        } catch(err) {
            console.error('Error while submitting the form:\n-----\n', err);
            setSubmitting(false);
            setStatusText('Something went wrong. Please contact the site owner.');
            setStatusCode(666);
            return;
        }
    }, [formIsValid, hasTeamsSelected, props.org])

    return <div className='mt-4'>
        <form ref={formRef} onInput={(e) => setFormValid(e.currentTarget.checkValidity())}>
            GitHub Email Address
            <input type='email' required id='github-invite-email' name='email' placeholder='e.g. vasco@constellation.na' className='w-1/2 m-4 px-2' />
            <div className='mb-8'>
                {teams?.map(t => teamSelector(t))}
            </div>
        </form>
        <button disabled={!formIsValid || !formRef.current?.checkValidity() || !hasTeamsSelected || isSubmitting} onClick={submit}>Send Invitation</button>

        {(()=>{
            if (isSubmitting) return <p>Submitting...</p>
            switch(statusCode) {
                case null:
                    return null;
                case 0:
                    return <>Loading...</>
                case 201:
                    return <p>Invitation sent!</p>
                case 404:
                    return <>
                        <br />
                        <p>Error: The organization could not be found.</p>
                        <p>Response from GitHub: {statusText}</p>
                        <p>Organization submitted: {props.org || '[NONE SPECIFIED]'}</p>
                    </>
                case 422:
                    return <>
                        <p>An error has occurred. Please see the below details.</p>
                        <p>{statusText === 'Validation Failed' ? 'The email you have submitted is invalid.' : statusText}</p>
                    </>
                case 666:
                    return <p>Something went very, very wrong. Please contact the site owner.</p>
            }
        })()}
    </div>
}