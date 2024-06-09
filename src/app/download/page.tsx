import { Orbitron } from 'next/font/google'
import NexusMods from '@/components/sidebar/Nexus Icon.svg';
import GitHub from '@/components/sidebar/github-mark-white.svg';
import Bethesda from '@/components/sidebar/Bethesda.svg';
import Image from 'next/image';
import { Metadata } from 'next';

const orb = Orbitron({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Download',
    description: 'Downloads for the Starfield Community Patch, no matter what platform you play on.',
}

export default function DownloadPage() {
    return (
        <div>
            <div className='mb-4'>
                <h1 className={orb.className} id='PC'>Download on PC</h1>
                <p>The latest version of the Community Patch will be available on Nexus Mods, Bethesda.net or GitHub as the official mirrors. </p>
                <br />
                <p>You may be able to download the patch from other sources, but these sources are not considered official and you should exercise caution when downloading them.</p>
                <div className='p-4 bg-stripe-orange my-4 border-2 border-black text-white'>
                    <b>Please note:</b> The Starfield Community Patch will always be available for free. If you are being prompted to pay for it, it is very likely that you are being scammed. 
                    The ZIP folder should only contain ESM, BA2, INI and text format files. Any other files (especially EXEs) should be considered malicious. 
                </div>
                <p>Selected your preferred download location below:</p>
                <div className='grid lg:grid-cols-3 grid-cols-1 gap-3 py-8'>
                <a href='https://nexusmods.com/starfield/mods/1' target='_blank'>
                    <button className='w-full'>
                        <Image
                            src={NexusMods}
                            alt={'Nexus Mods'}
                            width={24}
                            height={24}
                            className='inline mr-2'
                        />
                        Nexus Mods
                    </button>
                </a>
                <a href='https://github.com/Starfield-Community-Patch/Starfield-Community-Patch/releases' target='_blank'>
                    <button className='w-full'>
                        <Image
                            src={GitHub}
                            alt={'GitHub'}
                            width={24}
                            height={24}
                            className='inline mr-2'
                        />
                        GitHub
                    </button>
                </a>
                <a href='https://creations.bethesda.net/en/starfield/details/a11a0cdf-5abb-4a59-9e12-e261e5aae8d5/Starfield_Community_Patch' target='_blank'>
                    <button className='w-full'>
                        <Image
                            src={Bethesda}
                            alt={'Bethesda'}
                            width={24}
                            height={24}
                            className='inline mr-2 bg-white'
                        />
                        Bethesda.net
                    </button>
                </a>
                </div>
                <h2 className={orb.className} id='InstallPC'>Installation on PC</h2>
                <p>
                    It is recommended you install the Community Patch with a mod manager to avoid any confusion on where to place the files. 
                    The recommended applications are <a href='https://nexusmods.com/site/mods/1' target='_blank'>Vortex</a> or <a href='https://www.nexusmods.com/skyrimspecialedition/mods/6194' target='_blank'>Mod Organizer 2 (Steam only)</a>. Install the ZIP file with your mod manager and ensure that Starfield Community Patch.esm is enabled in the load order section.
                    <br /> <br/>
                    To install the patch manually, extract the contents of ZIP file into the Starfield game folder (where Starfield.exe is stored). To verify it is installed properly, check the Data subfolder includes <code>StarfieldCommunityPatch.esm</code>.
                    With the files installed, next navigate to <code>%localappdata%\Starfield</code> (you can paste this into the address bar of Windows Explorer) and locate the file plugins.txt. Open plugins.txt and add <code>* StarfieldCommunityPatch.esm</code> below the main Starfield plugin and any DLCs.
                </p>
                <h3 className={orb.className+' mt-4'} id='PCBethesda'>Bethesda.net on PC</h3>
                <p>
                    To install the mod via Bethesda.net, simply go to the mod page, log into your account and select &quot;Add to library&quot;. You can also select the mod to be installed from the &quot;Creations&quot; menu at the main menu of the game. 
                </p>
            </div>
            <hr />
            <div className='pt-4 mt-6'>
                <h1 className={orb.className} id='Xbox'>Download on Xbox Series X/S</h1>
                <div className='p-4 bg-stripe-orange my-4 border-2 border-black text-white'>
                Bethesda.net is now available for Starfield, but none of the existing team play on Xbox. This section will be updated with instructions soon. 
                </div>
                <div className='mb-24'>This section will be updated soon.</div>
                {/* <h2 className={orb.className} id='InstallXbox'>Installation on Xbox Consoles</h2> */}
            </div>
        </div>
    )
}