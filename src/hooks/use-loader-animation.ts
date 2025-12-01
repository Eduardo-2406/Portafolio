import { useState, useEffect, useRef, useMemo } from 'react';

// Duración del loader - OPTIMIZED FOR LCP
const LOADER_DURATION = 2500; // REDUCED from 5000 for faster LCP
// Delay antes de mover los marcos al centro (aparecen primero en esquinas)
const FRAMES_TO_CENTER_DELAY = 400; // REDUCED from 600 for faster LCP
// Tiempo de desaparición del loader
const LOADER_EXIT_DURATION = 1000; // REDUCED from 1600 for faster LCP

export interface LoaderAnimationState {
  appReady: boolean;
  loaderFramesReleased: boolean;
  loaderFramesToCenter: boolean;
  contentCanAnimate: boolean;
}

export function useLoaderAnimation(): LoaderAnimationState {
  const [appReady, setAppReady] = useState(false);
  const [loaderFramesToCenter, setLoaderFramesToCenter] = useState(false);
  const [contentCanAnimate, setContentCanAnimate] = useState(false);

  const timersRef = useRef<Array<number>>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Después de 600ms, mover los marcos al centro
    const framesTimer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setLoaderFramesToCenter(true);
    }, FRAMES_TO_CENTER_DELAY);

    // Después de 5s, marcar como listo (loader empieza a desaparecer)
    const readyTimer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setAppReady(true);
    }, LOADER_DURATION);

    // Después de 5s + 1.6s, el loader ha desaparecido completamente
    const animateTimer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setContentCanAnimate(true);
    }, LOADER_DURATION + LOADER_EXIT_DURATION);

    timersRef.current.push(framesTimer, readyTimer, animateTimer);
    const timers = [...timersRef.current];

    return () => {
      mountedRef.current = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Memoize returned object to avoid unnecessary re-renders in consumers
  return useMemo(
    () => ({
      appReady,
      loaderFramesReleased: appReady,
      loaderFramesToCenter,
      contentCanAnimate,
    }),
    [appReady, loaderFramesToCenter, contentCanAnimate],
  );
}
