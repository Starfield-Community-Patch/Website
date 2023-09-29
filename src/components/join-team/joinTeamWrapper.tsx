import { getTeams } from "@/util/GitHub/get-teams";
import JoinTeamForm from "./joinTeamForm";

export default async function JoinTeamWrapper() {
    try {
        if (!process.env.GITHUB_OWNER) throw new Error('GitHub owner is not set in the .env file, please contact the site owner.');
        const { GITHUB_OWNER } = process.env
        const teamQuery = await getTeams(GITHUB_OWNER);
        const teamList = teamQuery.data;

        return <JoinTeamForm teams={teamList} />

    }
    catch(err) {
        return (
            <div>
                Error getting team list: {(err as Error).message}
            </div>
        )

    }
}