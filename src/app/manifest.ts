import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PCOS Survey - You Deserve Better',
    short_name: 'PCOS Survey',
    description: 'Share your PCOS journey and get access to resources and community support',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F50057',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}