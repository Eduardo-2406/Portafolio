import type { Variants } from 'framer-motion';
import { ANIMATION_TIMING } from './animation-constants';

// Social icons animation variants
export const socialContainerVariants: Variants = {
  hidden: { opacity: 0 },
  // Delay children so lateral icons start after main section/form animations
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.5, staggerChildren: 0.08 }, // REDUCED from 1.8 for faster LCP
  },
  exit: { opacity: 0, transition: { duration: 0.35 } },
};

export const socialIconVariants: Variants = {
  // Start hidden: scaled down and invisible so scale-in + fade-in is noticeable
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: ANIMATION_TIMING.EASE_OUT_BACK },
  },
  // Exit: scale out + fade
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.45, ease: ANIMATION_TIMING.EASE_OUT_BACK },
  },
};

export const headerSpringTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  restDelta: 0.001,
};
