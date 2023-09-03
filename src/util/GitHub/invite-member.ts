import { ErrorWithHTTPCode } from "../errors";
import { octokit } from "./common";

export async function inviteTeamMember(...params: Parameters<typeof octokit['orgs']['createInvitation']>): Promise<ReturnType<typeof octokit['orgs']['createInvitation']>> {
    const { GITHUB_TOKEN } = process.env;
    if (!GITHUB_TOKEN) throw new ErrorWithHTTPCode(500, 'Request failed: Missing secrets, please contact the site owner.');

    try {
        return await octokit.orgs.createInvitation(...params)
    }
    catch(err) {
        const httpErr = (err as ErrorWithHTTPCode)
        throw httpErr;
    }
}
