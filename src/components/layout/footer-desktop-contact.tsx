"use client";

import { memo, useMemo } from "react";
import { m } from "framer-motion";
import { SocialIcon } from "@/components/social-icon";
import { socialLinks, type SocialPlatform } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
const easeBack = [0.34, 1.56, 0.64, 1] as const;
const CURRENT_YEAR = new Date().getFullYear();

const containerVariants = {
  hidden: {},
  // visible accepts a custom delayChildren so parent wrapper can control timing
  visible: (delay = 0) => ({
    transition: { staggerChildren: 0.08, delayChildren: delay },
  }),
};

const socialItemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: easeBack },
  },
};

export const DesktopContactFooter = memo(function DesktopContactFooter() {
  const platforms = useMemo(
    () => Object.keys(socialLinks) as SocialPlatform[],
    []
  );

  return (
    <m.aside
      className="w-72 xl:w-80 2xl:w-96 flex-shrink-0 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease } }}
    >
      <div className="h-full flex flex-col justify-between py-8 xl:py-10 px-6 xl:px-8 rounded-2xl border border-foreground/10 bg-card/20">
        <m.div
          className="space-y-8 xl:space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          custom={0}
        >
          {/* Info personal */}
          <m.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <m.h3
              className="text-3xl xl:text-4xl font-bold font-headline text-foreground leading-tight"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease }}
            >
              Eduardo R.
            </m.h3>
            <m.p
              className="text-base xl:text-lg text-muted-foreground leading-relaxed"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease }}
            >
              Frontend Developer creating modern web experiences.
            </m.p>
          </m.div>

          {/* Redes sociales */}
          <div className="space-y-4 pt-6 border-t border-foreground/10">
            <m.h4
              className="text-xs xl:text-sm font-semibold text-foreground/80 uppercase tracking-wider"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95, ease }}
            >
              Connect With Me
            </m.h4>

            <m.ul
              className="flex flex-col gap-2.5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              // children will scale+fade like in About's social buttons
              // start stagger after the header/texts complete
              custom={1.05}
            >
              {platforms.map((platform) => (
                <m.li
                  key={platform}
                  variants={socialItemVariants}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SocialIcon
                    platform={platform}
                    url={socialLinks[platform]}
                    variant="footer"
                  />
                </m.li>
              ))}
            </m.ul>
          </div>
        </m.div>

        {/* Copyright - Al final */}
        <m.div
          className="pt-8 mt-8 border-t border-foreground/10 space-y-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3, ease }}
        >
          <p className="text-xs xl:text-sm text-muted-foreground">
            © {CURRENT_YEAR} Eduardo R.
          </p>
          <p className="text-xs xl:text-sm text-muted-foreground leading-relaxed">
            Developed with Next.js, React, and Tailwind CSS
          </p>
        </m.div>
      </div>
    </m.aside>
  );
});
