
'use client';

import React, { memo } from 'react';
import { m } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { cubicBezier } from 'framer-motion';
import { EASE_OUT_QUINT_BEZIER } from '@/lib/animation-constants';

const ease = EASE_OUT_QUINT_BEZIER;

type ScrollDownIndicatorProps = {
  onClick: () => void;
  delay?: number;
};

const ScrollDownIndicatorBase = ({ onClick, delay = 0 }: ScrollDownIndicatorProps) => {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 };
  const animate = shouldReduceMotion
    ? { y: 0, opacity: 1 }
    : { y: 0, opacity: 1, transition: { duration: 0.3, delay, ease } };
  const exit = shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0, scale: 0.9, transition: { duration: 0.3, delay: 0, ease } };

  return (
    <m.button
      type="button"
      aria-label="Ir a la siguiente sección"
      initial={initial}
      animate={animate}
      exit={exit}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      onClick={onClick}
    >
      <div className="scrolldown">
        <div className="chevrons" aria-hidden>
          <div className="chevrondown" />
          <div className="chevrondown" />
        </div>
      </div>
    </m.button>
  );
};

ScrollDownIndicatorBase.displayName = 'ScrollDownIndicatorBase';

export const ScrollDownIndicator = memo(ScrollDownIndicatorBase);
