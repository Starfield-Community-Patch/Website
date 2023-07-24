import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';

interface NexusUserData extends Record<string, any> {
    sub: string;
    name: string;
    email: string;
    avatar: string;
    group_id: number;
    membership_roles: NexusMembershipRoles[];
}

type NexusMembershipRoles = 'member' | 'supporter' | 'premium' | 'lifetimepremium' | 'modauthor';


export default function NexusMods<P extends NexusUserData>(options: OAuthUserConfig<P>): OAuthConfig<P> {
    const { clientId, clientSecret } = options;
    return {
        id: 'nexusmods',
        name: 'Nexus Mods',
        clientId,
        clientSecret,
        type: "oauth",
        wellKnown: 'https://users.nexusmods.com/.well-known/openid-configuration',
        authorization: {
            params: { scope: 'openid email profile' }
        },
        idToken: true,
        profile(profile: NexusUserData) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.avatar
            }
        },
        style: {
            logo: 'https://www.nexusmods.com/assets/images/icons/notifications/nm-logo.svg',
            logoDark: 'https://www.nexusmods.com/assets/images/icons/notifications/nm-logo.svg',
            bg: 'darkorange',
            bgDark: 'darkorange',
            text: 'black',
            textDark: 'black',
        }
    }
};