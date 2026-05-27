import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RunCard Studio',
    short_name: 'RunCard',
    description: 'Dynamic, offline-ready route posters and sports stat card builders.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c1322',
    theme_color: '#0c1322',
    icons: [
      {
        src: 'https://ais-pre-73enacyf3jltvmpcghvucz-386385027518.asia-east1.run.app/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      }
    ],
  };
}
