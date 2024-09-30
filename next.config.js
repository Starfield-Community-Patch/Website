/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          { 
            protocol: 'https',
            hostname: 'avatars.nexusmods.com'
          },
          { 
            protocol: 'https',
            hostname: 'staticdelivery.nexusmods.com'
          },
          { 
            protocol: 'https',
            hostname: 'nexusmods.com'
          },
          { 
            protocol: 'https',
            hostname: 'forums.nexusmods.com'
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
          { 
            protocol: 'https',
            hostname: 'secure.gravatar.com'
          },
          {
            protocol: 'https',
            hostname: 'styles.redditmedia.com'
          }
        ]
      }
}

module.exports = nextConfig
