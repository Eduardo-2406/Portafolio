import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import dynamic from 'next/dynamic'; // Importante para Lazy Loading
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { FluidResize } from '@/components/fluid-resize';

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE CONFIGURATION (Lazy Load)
// ═══════════════════════════════════════════════════════════════════════════════

// Carga diferida del Wrapper de animación.
// 'ssr: true' permite que el HTML se genere, pero el JS de animación se hidrata después.
const MotionWrapper = dynamic(() => import('@/components/motion-wrapper'), {
  ssr: true
});

// ═══════════════════════════════════════════════════════════════════════════════
// FONT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
  // @ts-expect-error - fetchPriority is valid but not in types yet
  fetchPriority: 'high',
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
// CRITICAL SCRIPT (Theme Only)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Script minificado y crítico que SOLO maneja el tema para evitar FOUC.
 * La lógica de resize se movió al componente FluidResize para no bloquear el render.
 */
const themeScript = `(()=>{try{const s=localStorage.getItem('theme');const d=matchMedia('(prefers-color-scheme:dark)').matches;const t=s==='light'||s==='dark'?s:d?'dark':'light';document.documentElement.classList.add(t);}catch(_){}})();`;

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Script ultraligero que no bloquea el hilo principal */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <ErrorBoundary>
            {/* 1. Lógica de resize fuera del hilo crítico */}
            <FluidResize />
            
            {/* 2. Envoltura Lazy para reducir el bundle de JS inicial */}
            <MotionWrapper>
              <main>{children}</main>
            </MotionWrapper>
            
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}