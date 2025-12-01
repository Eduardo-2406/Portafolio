"use client";

import { ReactNode, useEffect, useState, useRef, useCallback, memo } from 'react';
import { cubicBezier } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingAnimation } from '@/registry/magicui/typing-animation';

const AnimatedHeading = memo(function AnimatedHeading({ 
  contentCanAnimate = true, 
  shouldAnimate = true 
}: { 
  contentCanAnimate?: boolean; 
  shouldAnimate?: boolean;
}) {
  // CUSTOMIZATION: Change these values to personalize your portfolio
  const name = "Eduardo";  // Your name
  const title = "Frontend Developer";  // Your job title
  
  const [showTyping, setShowTyping] = useState(shouldAnimate);
  const handleTypingDone = useCallback(() => setShowTyping(false), []);

  return (
    <div className="text-center">
      <h1 className="sr-only" aria-label={`Hey, I'm ${name} - ${title}`}>
        Hey, I&apos;m {name}
      </h1>
      
      {/* Animated Name */}
      <div style={{ minHeight: '120px' }} className="flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={contentCanAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <h2 
            className="font-headline font-bold text-foreground"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              letterSpacing: '-0.02em'
            }}
          >
            {/* Animated letters */}
            <span className="inline-block">
              {"Hey, I'm ".split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={contentCanAnimate && shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldAnimate ? 0.5 : 0,
                    delay: shouldAnimate ? 0.5 + i * 0.05 : 0,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <span className="inline-block bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              {name.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={contentCanAnimate && shouldAnimate ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: shouldAnimate ? 0.6 : 0,
                    delay: shouldAnimate ? 1.0 + i * 0.08 : 0,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>
        </motion.div>
      </div>

      {/* Subtitle with typing animation */}
      <div className="mt-1" style={{ minHeight: '3rem' }}>
        <span
          style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}
          className="inline-block font-semibold text-foreground"
        >
          {showTyping && shouldAnimate ? (
            <TypingAnimation
              className="text-foreground"
              speedMsPerChar={80}
              startDelayMs={2800}
              showCursorDelayMs={2500}
              onDone={handleTypingDone}
            >
              {title}
            </TypingAnimation>
          ) : (
            title
          )}
        </span>
      </div>
    </div>
  );
});

type AboutSectionProps = {
  children?: ReactNode;
  isCompact?: boolean;
  footerVisible?: boolean;
  setBlockNavigation?: (value: boolean) => void;
  navigate?: (index: number) => void;
  currentSection?: number;
  contentCanAnimate?: boolean;
};

// CUSTOMIZATION: Update this description to match your profile
const description = "I love building digital solutions that make sense from the ground up. I'm interested in the stage before code: organizing ideas, defining architecture, analyzing pros and cons, and thinking of clear solutions before moving a single line. The goal is for what you see on screen to feel fluid, useful, and backed by a solid structure.";

const easeCurve = cubicBezier(0.22, 1, 0.36, 1);
const headingMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay: 0.2, ease: easeCurve },
};
const descriptionMotion = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 4.5, ease: easeCurve },
};

export const AboutSection = memo(function AboutSection({ children, contentCanAnimate = true }: AboutSectionProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (contentCanAnimate && !hasAnimated) {
      const timer = window.setTimeout(() => setHasAnimated(true), 7000);
      return () => window.clearTimeout(timer);
    }
  }, [contentCanAnimate, hasAnimated]);

  const shouldAnimate = !hasAnimated;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full h-full min-h-dvh lg:min-h-0 flex flex-col items-center justify-center pb-10 sm:pb-12 md:pb-16 lg:pb-20 scroll-mt-16"
      aria-labelledby="about-heading"
    >
      <motion.div 
        className="w-full px-4 sm:px-8 md:px-12 lg:px-40 xl:px-40 2xl:px-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentCanAnimate ? 1 : 0 }}
        transition={{ duration: 0.01 }}
      >
        <motion.div
          className="flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto"
          initial="hidden"
          animate={contentCanAnimate ? "visible" : "hidden"}
        >
          <motion.div
            initial={headingMotion.initial}
            animate={contentCanAnimate ? headingMotion.animate : { opacity: 0 }}
            transition={headingMotion.transition}
          >
            <AnimatedHeading contentCanAnimate={contentCanAnimate} shouldAnimate={shouldAnimate} />
          </motion.div>
          <motion.div style={{ overflow: 'hidden' }} className="max-w-2xl mx-auto">
            <motion.p
              className="text-foreground/85 leading-loose"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
              initial={descriptionMotion.initial}
              animate={contentCanAnimate ? descriptionMotion.animate : descriptionMotion.initial}
              transition={descriptionMotion.transition}
            >
              {description}
            </motion.p>
          </motion.div>
          <AnimatePresence>
            {children}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
});
