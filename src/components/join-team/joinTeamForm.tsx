"use client"

import { ChangeEvent, Suspense, useState } from "react";
import { GitHubTeam } from "@/util/GitHub/common";

interface IProps {
    teams?: GitHubTeam[];
}

export default function JoinTeamForm(props: IProps) {
    const { teams } = props;

    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [myTeams, setMyTeams] = useState<GitHubTeam[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailValid(event.target.validity.valid);
    }

    const atLeastOneTeam = (): boolean => !!myTeams.length;

    const toggleTeam = (team: GitHubTeam) => {
        const selected = !!myTeams.find(t => t.id === team.id);
        if (selected) setMyTeams(myTeams.filter(t => t.id !== team.id))
        else setMyTeams([team, ...myTeams]);
    }

    const teamSelector = (team: GitHubTeam) => {
        return (
            <li>
                <input type='checkbox' checked={myTeams.includes(team)} onChange={() => toggleTeam(team)} />
                {team.name}
            </li>
        )
    }

    const submit = () => {

    }
    
    return (
        <div>
            <form>
                GitHub Email Address
                <input type='email' id='github-invite-email' placeholder='e.g. vasco@constellation.na' className='w-1/2 m-4 px-2' value={email} onChange={onEmailChange} />
            </form>
            <div>
                {teams?.map(t => teamSelector(t))}
            </div>
            <button disabled={emailValid === false || !atLeastOneTeam() || submitting}>Send Invitation</button>
        </div>
    )
}