import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import NexusModsProvider from './providers/nexusmods';

const OAuthProviders: NextAuthOptions = {
    providers: [
        // DiscordProvider({
        //     clientId: process.env.DISCORD_ID!,
        //     clientSecret: process.env.DISCORD_SECRET!
        // }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        NexusModsProvider({
            clientId: process.env.NEXUSMODS_ID!,
            clientSecret: process.env.NEXUSMODS_SECRET!
        })   
    ],
    secret: process.env.NEXTAUTH_SECRET
}

export default OAuthProviders;