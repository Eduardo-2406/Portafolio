'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.initParticlesIfAvailable = this.initParticlesIfAvailable.bind(this);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  componentDidUpdate(_: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // When error appears, try to initialize particles (if library is available)
    if (!prevState.hasError && this.state.hasError) {
      this.initParticlesIfAvailable();
    }
  }

  initParticlesIfAvailable() {
    try {
      // If particlesJS is available globally, initialize it with a gentle config.
      const win = window as unknown as Record<string, unknown>;
      const particlesFn = win?.particlesJS as unknown as ((id: string, cfg: unknown) => void) | undefined;
      if (typeof particlesFn === 'function') {
        particlesFn('particles-js', {
          particles: {
            number: { value: 5, density: { enable: true, value_area: 800 } },
            color: { value: '#fcfcfc' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 140, random: false, anim: { enable: true, speed: 10, size_min: 40 } },
            line_linked: { enable: false },
            move: { enable: true, speed: 8, out_mode: 'out' },
          },
          interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
          retina_detect: true,
        });
      }
    } catch (err) {
      // Silently ignore — particles are purely decorative
      logger.debug?.('particles init failed', err);
    }
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, prefer it (keeps backward compatibility)
      if (this.props.fallback) return this.props.fallback;

      // Fancy full-screen error UI (self-contained styles below)
      return (
        <div className="error-page-root" role="alert">
          <div className="error-page">
            <div>
              <h1 data-h1="404">404</h1>
              <p data-p="NOT FOUND">NOT FOUND</p>
            </div>
            <div id="particles-js" aria-hidden="true" />
            <button
              className="back"
              onClick={() => {
                // Try to go back in history first
                if (typeof window !== 'undefined') {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    // If no history, reload the page to reset state
                    window.location.href = '/';
                  }
                }
              }}
            >
              GO BACK
            </button>
          </div>

          <style jsx global>{`
            html, body { height: 100%; }
            .error-page-root { height: 100vh; overflow: hidden; }
            .error-page { display:flex; align-items:center; justify-content:center; text-align:center; height:100%; font-family: Inter, Arial, "Helvetica Neue", Helvetica, sans-serif; position:relative; }
            .error-page > div { z-index: 2 }
            .error-page h1 { font-size: 30vh; font-weight:700; position:relative; margin:-8vh 0 0; padding:0; }
            .error-page h1:after { content: attr(data-h1); position:absolute; top:0; left:0; right:0; color:transparent; background: linear-gradient(-45deg, #599692, #4a7d7a, #3d6865, #599692, #6ba9a5); background-size:400%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation: eb-animateTextBackground 10s ease-in-out infinite; }
            .error-page p { color:#d6d6d6; font-size:8vh; font-weight:700; line-height:10vh; max-width:600px; position:relative; margin-top:0.5rem }
            .error-page p:after { content: attr(data-p); position:absolute; top:0; left:0; right:0; color:transparent; background:transparent; -webkit-background-clip:text; background-clip:text }
            #particles-js { position:fixed; top:0; right:0; bottom:0; left:0; z-index:1 }
            @keyframes eb-animateTextBackground { 0%{background-position:0 0}25%{background-position:100% 0}50%{background-position:100% 100%}75%{background-position:0 100%}100%{background-position:0 0} }
            @media (max-width:767px) { .error-page h1{ font-size:32vw } .error-page p{ font-size:8vw; line-height:10vw; max-width:70vw } }
            .back { position: fixed; right:40px; bottom:40px; background: linear-gradient(135deg, #599692, #4a7d7a); border: none; border-radius:8px; box-shadow:0 4px 12px rgba(89, 150, 146, 0.3); color:#fff; font-size:16px; font-weight:700; line-height:24px; padding:15px 30px; text-decoration:none; transition:all 0.3s ease; z-index:3; cursor:pointer; }
            .back:hover { box-shadow:0 6px 20px rgba(89, 150, 146, 0.5); transform: translateY(-2px); background: linear-gradient(135deg, #4a7d7a, #599692); }
            .back:active { transform: translateY(0); box-shadow:0 2px 8px rgba(89, 150, 146, 0.4); }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
