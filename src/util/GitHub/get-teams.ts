import { ErrorWithHTTPCode } from "../errors";
import { octokit } from "./common";

export async function getTeams(org: string, page: number = 0): Promise<ReturnType<typeof octokit['teams']['list']>> {
    const { GITHUB_TOKEN } = process.env;
    if (!GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    try {
        return await octokit.teams.list({
            per_page: 100,
            page,
            org,
        })
    }
    catch(err) {
        const httpErr = (err as ErrorWithHTTPCode)
        throw httpErr;
    }
}
