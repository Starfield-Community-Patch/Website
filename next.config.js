/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [ '*.nexusmods.com', 'avatars.githubusercontent.com' ],
        remotePatterns: [
          { 
            protocol: 'https',
            hostname: 'staticdelivery.nexusmods.com'
          },
          { 
            protocol: 'https',
            hostname: 'forum.nexusmods.com'
          },
          { 
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com'
          },
          { 
            protocol: 'https',
            hostname: 'cdn.discordapp.com'
          },
        ]
      }
}

module.exports = nextConfig
