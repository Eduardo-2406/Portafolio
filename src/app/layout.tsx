import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';

// ═══════════════════════════════════════════════════════════════════════════════
// FONT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap', // Better for LCP, ensures text is visible immediately
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
});

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA & SEO
// ═══════════════════════════════════════════════════════════════════════════════

const siteConfig = {
  name: 'Portfolio',
  description: 'A modern developer portfolio, built with Next.js and Tailwind CSS.',
  url: 'https://your-domain.com',
  author: 'Eduardo',
  locale: 'en_US',
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['portfolio', 'developer', 'frontend', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f0f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION SCRIPTS (prevent FOUC and configure fluid scale)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Combined script executed before render:
 * 1. Applies saved theme to prevent Flash of Unstyled Content (FOUC)
 * 2. Configures fluid viewport scale for large screens
 */
const initScript = `(()=>{
try{
// Theme initialization
const s=localStorage.getItem('theme');
const d=matchMedia('(prefers-color-scheme:dark)').matches;
const t=s==='light'||s==='dark'?s:d?'dark':'light';
document.documentElement.classList.add(t);

// Fluid scale for desktop (>=1280px)
const D=1920;
function f(){
const w=Math.max(document.documentElement.clientWidth,innerWidth||0);
document.documentElement.style.fontSize=w<1280?'16px':(16*Math.min(Math.max(w/D,.75),1.35))+'px';
}
f();
let r=0;
addEventListener('resize',()=>{r&&cancelAnimationFrame(r);r=requestAnimationFrame(f);},{passive:true});
}catch(_){}
})();`;

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={spaceGrotesk.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
