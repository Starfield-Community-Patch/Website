import { query } from 'gql-query-builder';
const v2API: string = 'https://api.nexusmods.com/v2/graphql';

const multiUserQuery = (users: number[]) => query(users.map(u => (
    {
        operation: {
            name: 'user',
            alias: `user_${u}`
        },
        variables: {
            [`user_${u}`]: {
                type: 'Int',
                name: 'id',
                value: u,
                required: true
            }
        },
        fields: [ 'name', 'memberId', 'avatar' ]
    
    }
)), null, { operationName: 'MultiUsersByID' })

export interface INexusModsUser {
    name?: string;
    memberId: number;
    avatar?: string;
}

interface IMultiUserResult {
    data: {
        [key: string] : INexusModsUser
    }
    errors?: {
        message: string;
        locations: string[];
        path: string[];
        extensions: any;
    }[]
}

export default async function getMultipleUsers(ids: Set<number>) {
    if (!ids.size) return {};

    const nexusQuery = multiUserQuery([...ids])

    const nexusReq = await fetch(v2API, {
        method: 'POST',
        body: JSON.stringify(nexusQuery),
        headers: {
            'Content-Type': 'application/json',
        },
        next: { revalidate: 10 }
    });

    if (nexusReq.ok) {
        const response: IMultiUserResult = await nexusReq.json()
        if (response.errors) {
            let retry = true;
            let newIds = [...ids];
            for(const error of response.errors) {
                // We have to remove invalid user IDs are retrun the entire query.
                const badUserId = error.message.match(/User with id ([0-9]+) not found/)?.[1];
                if (badUserId) {
                    newIds = newIds.filter(id => id !== parseInt(badUserId));
                    retry = newIds.length > 0
                } 
                else console.log('Unhandled GQL error', {error, newIds})                   
            }
            if (retry) return getMultipleUsers(new Set(newIds));
            else throw new Error(`Unrecognised server error(s): ${response.errors?.map(e => e.message).join('\n')}`)
        }
        else return response.data;
    }
    else {
        throw new Error(`${nexusReq.status} - ${nexusReq.statusText}`)
    }
}
