// Animation timing constants and easing curves
export const ANIMATION_TIMING = {
  // Transiciones de sección (ajustadas para sincronizar con los marcos)
  // Salida del contenido: rápido para que desaparezca antes de que los marcos lleguen al centro.
  CONTENT_EXIT_DURATION: 0.45,
  // Retardo antes de que el contenido vuelva a aparecer (debe coincidir con el retorno de marcos)
  CONTENT_ENTER_DELAY: 0.2,
  // Duración de entrada del contenido
  CONTENT_ENTER_DURATION: 0.4,
  // Tiempo total de la transición (en ms). Debe cubrir: fade-out -> marcos al centro/cruce -> marcos regreso -> fade-in inicio
  TOTAL_TRANSITION_MS: 1000,
  // Delays de contenido inicial - OPTIMIZED FOR LCP
  SOCIAL_ICONS_DELAY: 0.3, // REDUCED from 1.5 for faster LCP
  SCROLL_INDICATOR_DELAY_ABOUT: 0.8, // REDUCED from 2.5 for faster LCP
  SCROLL_INDICATOR_DELAY_MOBILE: 0.6, // REDUCED from 2 for faster LCP
  // Easing curves (cubic-bezier)
  EASE_OUT_EXPO: [0.76, 0, 0.24, 1],
  EASE_OUT_BACK: [0.34, 1.56, 0.64, 1],
  EASE_OUT_QUINT: [0.22, 1, 0.36, 1],
  EASE_OUT_CIRC: [0.25, 0.46, 0.45, 0.94],
} as const;

export const COMPACT_THRESHOLD_PX = 540;
export const LOADER_SPANS_COUNT = 15;

// Common easing function used across multiple components
// Consolidates duplicate definitions from skills-section, portfolio-section, scroll-down-indicator
export const EASE_OUT_QUINT_BEZIER = [0.22, 1, 0.36, 1] as const;
