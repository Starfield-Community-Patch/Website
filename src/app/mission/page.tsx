import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Our Mission - Starfield Community Patch'
}

const orb = Orbitron({ subsets: ['latin'] })

export default function MissionPage() {
    return (
        <div>
            <h1 className={orb.className}>Mission Statement</h1>
            <div className='mb-4'>
                The Starfield Community Patch (SCP) project is a collective effort by mod authors and the wider player community of Starfield to fix bugs, errors and other inconsistencies present in the game. This includes tweaks, typos and other changes that may have been missed (or not yet released) by the developers. The overall goal is to improve the vanilla experience for all players.
            </div>
            <h2 className={orb.className}>Scope</h2>
            <div className='mb-4'>
            Fixes included in the patch are intended to correct bugs or errors in the base game, examples include:
            <ul>
                <li>Misplaced objects</li>
                <li>Script errors</li>
                <li>Inconsistencies in item properties</li>
                <li>Faulty missions/quests</li>
                <li>Game-breaking exploits</li>
                <li>Missing attributes (such as tags, header flags, etc)</li>
                <li>Spelling errors</li>
            </ul>
            The patch is not intended to include any of the following:
            <ul>
                <li>New content (new quests, missions, characters, items, etc)</li>
                <li>Balance changes (outside of correcting obvious errors)</li>
                <li>Any tweaks that are not inkeeping with the original vision for game</li>
            </ul>
            </div>
            <h2 className={orb.className}>Organisation</h2>
            <div className='mb-4'>
            The Community Patch is intended be owned by the community, rather than an individual or team. This means it will be open to contributors and the responsibility for creating the latest build may shift and change over the life of the game.
            </div>
            <div className='mb-4'>
            The &quot;official&quot; releases will be made available on Nexus Mods, with more bleeding edge builds shared via GitHub (TBC) or in private testing groups.
            </div>
            <div className='mb-4'>
            There is intended to be a core team of contributors who are likely to be trusted content creators who will manage the merging and applying of the fixes before shipping it to users.
            </div>
            <div className='mb-4'>
            The project uses <a href='https://github.com/Starfield-Community-Patch/Starfield-Community-Patch/blob/main/LICENSE' target='_blank'>an MIT license</a> which means the patch itself is open source, but any mods that depend it are welcome to use any permissions or license defined by the mod author.
            </div>
            <div className='mb-4'>
            The Community Patch (in whole or in part) should never require payment to access, this includes any &quot;early access&quot; builds. The patch itself will allow donations and will earn reward points via the Nexus Mods Donation Points Scheme. These donations will be distributed (as fairly as possible) among the core contributors to the project. The details of which should be posted publicly for accountability.
            </div>
            <h2 className={orb.className}>Contribute</h2>
            <div className='mb-4'>
            You don&#39;t have to be a mod author to contribute to the Community Patch! There are a few different ways to do so.
            <ul>
                <li>To <Link href={'report'}>report bugs</Link> that you feel the Community Patch should address, please see the bug report process.</li>
                <li>To submit a fix for a bug in the game that you&#39;d like to include in the Community Patch, please see the merge request process (Process TBC).</li>
            </ul>
            Please remember that any information or changes you share for the Community Patch will be released freely for others to use.
            </div>
        </div>
    )
}