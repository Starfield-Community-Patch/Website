import { NextAuthOptions, Session } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import NexusModsProvider from './providers/nexusmods';
import { JWT } from 'next-auth/jwt';

const OAuthProviders: NextAuthOptions = {
    providers: [
        // DiscordProvider({
        //     clientId: process.env.DISCORD_ID!,
        //     clientSecret: process.env.DISCORD_SECRET!
        // }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID!,
        //     clientSecret: process.env.GITHUB_SECRET!
        // }),
        NexusModsProvider({
            clientId: process.env.NEXUSMODS_ID!,
            clientSecret: process.env.NEXUSMODS_SECRET!
        })   
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // async jwt(params: { 
        //     token: any,
        //     user: any,
        //     account: any,
        //     profile?: any,
        //     trigger?: string,
        //     isNewUser?: boolean,
        //     session?: any
        //  }): Promise<any> {
            
        //     if (params.account?.accessToken) {
        //         params.token.accessToken = params.account?.accessToken
        //         console.log('Account token', { access: params.account.accessToken, token: params.token })
        //     }
        //     // else console.log('JWT CALLBACK', params);
        //     return params.token
        // },
        async session(params: { session: Session, token: JWT }): Promise<any> {
            // console.log('Session callback', params);
            return { id: params.token.sub, ...params.session};
        }
    }
}

export default OAuthProviders;