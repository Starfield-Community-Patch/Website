import { getTeams } from "@/util/GitHub/get-teams";
import JoinTeamForm from "./joinTeamForm";

export default async function JoinTeamWrapper() {
    try {
        if (!process.env.GITHUB_OWNER) throw new Error('GitHub owner is not set in the .env file, please contact the site owner.');
        const { GITHUB_OWNER } = process.env
        const teamQuery = await getTeams(GITHUB_OWNER);
        const teamList = teamQuery.data;

        return <JoinTeamForm teams={teamList} org={process.env.GITHUB_OWNER} />

    }
    catch(err) {
        return <>
            <br />
            <h2>Error getting team list:</h2>
            <p>{err instanceof Error ? err.message : String(err)}</p>
        </>
    }
}