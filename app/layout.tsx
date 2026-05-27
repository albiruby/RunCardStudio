import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { Activity, Moon } from 'lucide-react';
import './globals.css';
import DraftSafeGuard from './studio/components/DraftSafeGuard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'RunCard Studio',
  description: 'Local-first sports card generator for runners, athletes, and coaches.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('runcard-theme') || 'dark';
                if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <DraftSafeGuard />
        <header className="border-b border-brand-border bg-brand-bg sticky top-0 z-50">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary-action hover:opacity-80 transition-opacity">
              <Activity className="w-5 h-5 text-primary-action" />
              <span className="font-bold text-lg tracking-tight uppercase text-text-primary">RunCard Studio</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/studio" className="text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors hover:border-b-2 border-primary-action py-1">
                Studio
              </Link>
              <Link href="/drafts" className="text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors hover:border-b-2 border-transparent py-1">
                Drafts
              </Link>
              <Link href="/settings" className="text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors hover:border-b-2 border-transparent py-1">
                Settings
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex border border-brand-border px-2 py-1 rounded text-xs font-mono text-secondary-lime uppercase bg-surface">
                LOCAL-FIRST / OFFLINE READY
              </div>
              <Link 
                href="/settings"
                title="Settings"
                className="w-8 h-8 flex items-center justify-center border border-brand-border rounded hover:bg-surface transition-colors"
                aria-label="Settings"
              >
                <Activity className="w-4 h-4 text-text-muted" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full bg-brand-bg">
          {children}
        </main>

        <footer className="border-t border-brand-border bg-surface-lowest">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between text-xs font-mono text-text-muted uppercase">
            <div className="flex gap-4 items-center">
              <span>RunCard Studio</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-primary-coral transition-colors underline decoration-dotted">Privacy / About</Link>
            </div>
            <div className="hidden sm:block">Privacy: No Login, No Database, Open Source</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
