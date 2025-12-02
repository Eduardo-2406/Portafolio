"use client";

import { useState, useCallback, memo, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import type { Variants } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting - reduces initial bundle size
// AboutSection needs SSR for SEO, but others can be client-only
const AboutSection = dynamic(() => import('@/components/sections/about-section').then(mod => mod.AboutSection));

// Below-the-fold sections - no SSR needed, reduces initial bundle significantly
const PortfolioSection = dynamic(
  () => import('@/components/sections/portfolio-section').then(mod => mod.PortfolioSection),
  { ssr: false }
);
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then(mod => mod.SkillsSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(mod => mod.ContactSection),
  { ssr: false }
);

// Layout components - keep SSR for initial paint
const DesktopHeader = dynamic(() => import('@/components/layout/desktop-header').then(mod => mod.DesktopHeader));
const Header = dynamic(() => import('@/components/layout/header').then(mod => mod.Header));
const Footer = dynamic(() => import('@/components/layout/footer').then(mod => mod.Footer));
const DesktopContactFooter = dynamic(() => import('@/components/layout/footer-desktop-contact').then(mod => mod.DesktopContactFooter));

// Client-only components - no SSR needed
const CornerFrames = dynamic(() => import('@/components/corner-frames').then(mod => mod.CornerFrames), { ssr: false });
const ScrollToTopButton = dynamic(() => import('@/components/scroll-to-top-button').then(mod => mod.ScrollToTopButton), { ssr: false });

// Optimize below-the-fold UI components
const ScrollDownIndicator = dynamic(() => import('@/components/ui/scroll-down-indicator').then(mod => mod.ScrollDownIndicator), { ssr: false });
const SocialIcon = dynamic(() => import('@/components/social-icon').then(mod => mod.SocialIcon), { ssr: false });

// Keep critical imports
import type { NavItem } from '@/lib/nav-links';
import { socialLinks, type SocialPlatform } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSectionNavigation } from '@/hooks/use-section-navigation';
import { useTheme } from '@/components/providers/theme-provider';
import { useCursorStyle } from '@/hooks/use-cursor-style';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useLoaderAnimation } from '@/hooks/use-loader-animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ScrollRevealSection } from '@/components/scroll-reveal-section';

// Animation constants and variants (extracted for code splitting)
import { ANIMATION_TIMING, COMPACT_THRESHOLD_PX, LOADER_SPANS_COUNT } from '@/lib/animation-constants';
import { socialContainerVariants, socialIconVariants, headerSpringTransition } from '@/lib/animation-variants';

// Lazy load componentes pesados que solo se usan en desktop
const SmoothCursor = lazy(() => 
  import('@/components/ui/smooth-cursor').then(mod => ({ default: mod.SmoothCursor }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

interface DesktopViewProps {
  onSectionTransitionChange?: (value: boolean) => void;
  onSectionChange?: (section: number) => void;
  prefersReducedMotion?: boolean;
  contentCanAnimate?: boolean;
}

interface MobileViewProps {
  contentCanAnimate?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'about', component: AboutSection },
  { id: 'portfolio', component: PortfolioSection },
  { id: 'skills', component: SkillsSection },
  { id: 'contact', component: ContactSection },
] as const;

const SOCIAL_PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'whatsapp', 'cv'];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/** Renderiza los iconos sociales con animación escalonada */
const AnimatedSocialIcons = memo(function AnimatedSocialIcons({ 
  contentCanAnimate, 
  variant = 'about',
  baseDelay = ANIMATION_TIMING.SOCIAL_ICONS_DELAY,
}: { 
  contentCanAnimate: boolean; 
  variant?: 'about' | 'lateral';
  baseDelay?: number;
}) {
  return (
    <>
      {SOCIAL_PLATFORMS.map((platform, idx) => (
        <m.div
          key={platform}
          initial={{ opacity: 0, scale: 0 }}
          animate={contentCanAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{
            duration: 0.6,
            delay: baseDelay + idx * 0.1,
            ease: ANIMATION_TIMING.EASE_OUT_BACK,
          }}
        >
          <SocialIcon platform={platform} url={socialLinks[platform]} variant={variant} />
        </m.div>
      ))}
    </>
  );
});

/** Loader spans generados programáticamente */
const LoaderSpans = memo(function LoaderSpans() {
  return (
    <>
      {Array.from({ length: LOADER_SPANS_COUNT }, (_, i) => (
        <span key={i} />
      ))}
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const DesktopView = memo(function DesktopView({ 
  onSectionTransitionChange, 
  onSectionChange, 
  prefersReducedMotion, 
  contentCanAnimate = false 
}: DesktopViewProps) {
  const { currentSection, navigate, setBlockNavigation } = useSectionNavigation(SECTIONS.length);
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeightPx, setContentHeightPx] = useState(0);
  const [sectionContentVisible, setSectionContentVisible] = useState(false);
  const [contactCardEntered, setContactCardEntered] = useState(false);
  const previousSectionRef = useRef(currentSection);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstTransition = useRef(true);
  
  const isInContactSection = currentSection === SECTIONS.length - 1;
  const isCompactLayout = contentHeightPx > 0 && contentHeightPx < COMPACT_THRESHOLD_PX;
  const CurrentComponent = SECTIONS[currentSection].component;
  const contentEnterDelayDynamic = ANIMATION_TIMING.CONTENT_ENTER_DELAY;
  const contentEnterDurationDynamic = ANIMATION_TIMING.CONTENT_ENTER_DURATION;

  // Notificar cambios de sección al padre
  useEffect(() => {
    onSectionChange?.(currentSection);
  }, [currentSection, onSectionChange]);

  // Observar altura del contenedor
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContentHeightPx(entry.contentRect.height);
    });
    
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Manejar transiciones de sección
  useEffect(() => {
    const previousSection = previousSectionRef.current;
    previousSectionRef.current = currentSection;

    if (isFirstTransition.current) {
      isFirstTransition.current = false;
      return;
    }

    if (currentSection === previousSection) return;

    // Limpiar timeout previo
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    onSectionTransitionChange?.(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      onSectionTransitionChange?.(false);
    }, ANIMATION_TIMING.TOTAL_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentSection, onSectionTransitionChange]);

  const handleNavigate = useCallback((href: NavItem["href"]) => {
    const sectionId = href.slice(1); // Más eficiente que substring(1)
    const sectionIndex = SECTIONS.findIndex((s) => s.id === sectionId);
    if (sectionIndex !== -1) {
      navigate(sectionIndex);
    }
  }, [navigate]);

  const handleAnimationStart = useCallback(() => {
    setBlockNavigation(true);
    setSectionContentVisible(false);
    setContactCardEntered(false);
  }, [setBlockNavigation]);

  const handleAnimationComplete = useCallback(() => {
    const shouldBlock = SECTIONS[currentSection]?.id === 'portfolio';
    setBlockNavigation(shouldBlock);
    setSectionContentVisible(true);
  }, [currentSection, setBlockNavigation]);

  const handleScrollDown = useCallback(() => {
    navigate(currentSection + 1);
  }, [navigate, currentSection]);

  return (
    <div className="relative h-dvh w-full flex flex-col cursor-none overflow-hidden">
      {/* Cursor personalizado - lazy loaded */}
      {!prefersReducedMotion && (
        <Suspense fallback={null}>
          <SmoothCursor theme={theme} />
        </Suspense>
      )}

      {/* Header */}
      <m.div 
        className="relative z-20"
        initial={{ y: -100, opacity: 0 }}
        animate={contentCanAnimate ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={headerSpringTransition}
      >
        <DesktopHeader onNavigate={handleNavigate} activeSection={currentSection} />
      </m.div>

      {/* Contenido principal */}
      <div 
        ref={contentRef} 
        className="relative z-10 flex-1 overflow-hidden" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="wait" initial>
          <m.div
            key={currentSection}
            className="absolute inset-0 flex"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: contentEnterDurationDynamic,
                delay: contentEnterDelayDynamic,
                ease: ANIMATION_TIMING.EASE_OUT_EXPO,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              transition: {
                duration: ANIMATION_TIMING.CONTENT_EXIT_DURATION,
                ease: ANIMATION_TIMING.EASE_OUT_EXPO,
              },
            }}
            onAnimationStart={handleAnimationStart}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="w-full h-full overflow-hidden">
              <m.div
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: contentCanAnimate ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: ANIMATION_TIMING.EASE_OUT_EXPO }}
                style={{ willChange: 'opacity' }}
              >
                {
                  CurrentComponent === PortfolioSection ? (
                    <PortfolioSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                      contentEnterDelay={ANIMATION_TIMING.CONTENT_ENTER_DELAY}
                    >
                      {currentSection === 0 && (
                        <m.div
                          className="flex items-center gap-5 pt-4"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={contentCanAnimate 
                            ? { opacity: 1, y: 0, scale: 1 } 
                            : { opacity: 0, y: 20, scale: 0.95 }
                          }
                          transition={{ 
                            duration: 0.8, 
                            delay: ANIMATION_TIMING.SOCIAL_ICONS_DELAY, 
                            ease: ANIMATION_TIMING.EASE_OUT_QUINT 
                          }}
                        >
                          <AnimatedSocialIcons 
                            contentCanAnimate={contentCanAnimate} 
                            variant="about" 
                          />
                        </m.div>
                      )}
                    </PortfolioSection>
                  ) : CurrentComponent === SkillsSection ? (
                    <SkillsSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                    />
                  ) : CurrentComponent === ContactSection ? (
                    <ContactSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      parentContentVisible={sectionContentVisible}
                      onCardEntered={setContactCardEntered}
                    />
                  ) : (
                    <CurrentComponent
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                    >
                      {currentSection === 0 && (
                        <m.div
                          className="flex items-center gap-5 pt-4"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={contentCanAnimate 
                            ? { opacity: 1, y: 0, scale: 1 } 
                            : { opacity: 0, y: 20, scale: 0.95 }
                          }
                          transition={{ 
                            duration: 0.8, 
                            delay: ANIMATION_TIMING.SOCIAL_ICONS_DELAY, 
                            ease: ANIMATION_TIMING.EASE_OUT_QUINT 
                          }}
                        >
                          <AnimatedSocialIcons 
                            contentCanAnimate={contentCanAnimate} 
                            variant="about" 
                          />
                        </m.div>
                      )}
                    </CurrentComponent>
                  )
                }
              </m.div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Iconos sociales laterales (secciones intermedias) */}
      <AnimatePresence>
        {currentSection > 0 && currentSection < SECTIONS.length - 1 && (
          <m.div
            className="fixed bottom-1/2 translate-y-1/2 left-4 z-50 flex flex-col gap-4"
            variants={socialContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Incremented delay so lateral social icons appear later and don't feel abrupt
            transition={{ delay: 1.8, duration: 0.4 }}
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <m.div key={platform} variants={socialIconVariants}>
                <SocialIcon
                  platform={platform}
                  url={socialLinks[platform]}
                  variant="lateral"
                />
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
      
      {/* Indicador de scroll */}
      <AnimatePresence>
        {currentSection < SECTIONS.length - 1 && (
          <ScrollDownIndicator 
            onClick={handleScrollDown} 
            delay={currentSection === 0 ? ANIMATION_TIMING.SCROLL_INDICATOR_DELAY_ABOUT : 0}
          />
        )}
      </AnimatePresence>

      {/* Footer lateral para sección de contacto */}
      <AnimatePresence>
        {isInContactSection && contactCardEntered && (
          <m.div
            className="fixed left-4 xl:left-6 2xl:left-8 top-[4rem] bottom-0 z-40 py-8 xl:py-10 flex items-center"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            // Apply a larger extra delay so footer container and its content
            // enter noticeably after the contact card completes.
            transition={{ duration: contentEnterDurationDynamic, delay: 0.5, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
            // Salida: duración 0.45s para coincidir con ContactSection exit
            exit={{ x: -30, opacity: 0, transition: { duration: ANIMATION_TIMING.CONTENT_EXIT_DURATION, ease: ANIMATION_TIMING.EASE_OUT_QUINT } }}
          >
            <DesktopContactFooter />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const MobileView = memo(function MobileView({ contentCanAnimate = false }: MobileViewProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(true);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5 && !hasScrolled) {
        setHasScrolled(true);
        scrollTimeoutRef.current = setTimeout(() => {
          setShowFullAbout(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasScrolled]);

  const handleScrollToPortfolio = useCallback(() => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col min-h-[100svh]" style={{ touchAction: 'pan-y' }}>
      {/* Header */}
      <m.div 
        style={{ touchAction: 'auto' }}
        initial={{ y: -100, opacity: 0 }}
        animate={contentCanAnimate ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={headerSpringTransition}
      >
        <Header />
      </m.div>

      <main className="flex-1 flex flex-col gap-6" style={{ touchAction: 'auto' }}>
        {/* About Section - altura condicional */}
        <m.div
          animate={{
            height: showFullAbout ? '100dvh' : 'auto',
            overflow: showFullAbout ? 'hidden' : 'visible',
          }}
          transition={{ duration: 0.4, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
        >
          <AboutSection contentCanAnimate={contentCanAnimate}>
            <div className="flex items-center gap-6 pt-4">
              <AnimatedSocialIcons contentCanAnimate={contentCanAnimate} variant="lateral" />
            </div>
          </AboutSection>
        </m.div>
        
        {/* Secciones restantes con scroll reveal */}
        <ScrollRevealSection delay={0.1}>
          <PortfolioSection isMobileOverride />
        </ScrollRevealSection>
        
        <ScrollRevealSection delay={0.15}>
          <SkillsSection />
        </ScrollRevealSection>
        
        <ScrollRevealSection delay={0.2}>
          <ContactSection />
        </ScrollRevealSection>
      </main>
      
      {/* Indicador de scroll */}
      <AnimatePresence mode="wait">
        {!hasScrolled && (
          <ScrollDownIndicator 
            delay={ANIMATION_TIMING.SCROLL_INDICATOR_DELAY_MOBILE} 
            onClick={handleScrollToPortfolio} 
          />
        )}
      </AnimatePresence>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const isMobileView = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [sectionTransitioning, setSectionTransitioning] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  // Hooks de animación y efectos secundarios
  const { appReady, loaderFramesReleased, loaderFramesToCenter, contentCanAnimate } = useLoaderAnimation();
  useCursorStyle(isMobileView);
  useScrollLock(appReady, isMobileView);

  // Calcular estado de marcos de forma declarativa
  const frameState = (() => {
    if (prefersReducedMotion) return 'rest';
    if (!appReady) {
      if (loaderFramesReleased) return 'aboutFrame';
      if (loaderFramesToCenter) return 'active';
      return 'rest';
    }
    if (sectionTransitioning) return 'active';
    return currentSectionIndex === 0 ? 'aboutFrame' : 'rest';
  })() as 'active' | 'rest' | 'aboutFrame' | 'hidden';

  return (
    <>
      {/* Marcos decorativos (solo desktop ≥1280px) */}
      {!isMobileView && <CornerFrames frameState={frameState} />}

      {/* Cursor personalizado (solo desktop, lazy loaded) */}
      {!isMobileView && (
        <Suspense fallback={null}>
          <SmoothCursor theme={prefersReducedMotion ? 'light' : 'dark'} />
        </Suspense>
      )}

      {/* Botón scroll to top (carga solo cuando se hace scroll) */}
      <ScrollToTopButton />

      <div className="relative min-h-screen">
        <AnimatePresence mode="wait" initial>
          {!appReady ? (
            <m.div
              key="loader"
              className="loader-container fixed inset-0 overflow-hidden bg-background"
              initial={{ opacity: 1 }}
              animate={{ opacity: loaderFramesReleased ? 0 : 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1, ease: ANIMATION_TIMING.EASE_OUT_EXPO }} // REDUCED from 1.6 for faster LCP
            >
              {/* Telón del loader */}
              <m.div
                className="absolute inset-0 z-0 bg-background"
                style={{ originX: 0.5 }}
                initial={{ scaleX: 1, opacity: 1 }}
                animate={{
                  scaleX: loaderFramesReleased ? 0 : 1,
                  opacity: loaderFramesReleased ? 0 : 1,
                }}
                transition={{ duration: 1, ease: ANIMATION_TIMING.EASE_OUT_EXPO }} // REDUCED from 1.6 for faster LCP
              />

              {/* Animación del loader */}
              <m.div
                className="relative z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: loaderFramesReleased ? 0.95 : 1,
                  opacity: loaderFramesReleased ? 0 : 1,
                }}
                transition={{
                  scale: loaderFramesReleased 
                    ? { duration: 1, ease: ANIMATION_TIMING.EASE_OUT_EXPO } // REDUCED from 1.4
                    : { duration: 1.2, delay: 1.4, ease: ANIMATION_TIMING.EASE_OUT_BACK },
                  opacity: loaderFramesReleased
                    ? { duration: 1, ease: ANIMATION_TIMING.EASE_OUT_QUINT } // REDUCED from 1.4
                    : { duration: 1.2, delay: 1.4, ease: ANIMATION_TIMING.EASE_OUT_QUINT },
                }}
              >
                <div className="loader">
                  <LoaderSpans />
                </div>
              </m.div>
            </m.div>
          ) : (
            <m.div 
              key="app" 
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: contentCanAnimate ? 1 : 0, 
                y: contentCanAnimate ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
            >
              {isMobileView ? (
                <MobileView contentCanAnimate={contentCanAnimate || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('forceAnim') === '1')} />
              ) : (
                <DesktopView
                  onSectionTransitionChange={setSectionTransitioning}
                  onSectionChange={setCurrentSectionIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  contentCanAnimate={contentCanAnimate || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('forceAnim') === '1')}
                />
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
