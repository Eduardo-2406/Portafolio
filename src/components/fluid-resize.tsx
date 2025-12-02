"use client";

import { useEffect } from "react";

export function FluidResize() {
  useEffect(() => {
    // Tu lógica original de escala fluida, ejecutada de forma segura
    const D = 1920;
    const f = () => {
      const w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      document.documentElement.style.fontSize =
        w < 1280 ? "16px" : `${16 * Math.min(Math.max(w / D, 0.75), 1.35)}px`;
    };

    // Ejecutar una vez al montar
    f();

    let r: number;
    const handler = () => {
      if (r) cancelAnimationFrame(r);
      r = requestAnimationFrame(f);
    };

    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  return null; // No renderiza nada visual
}
