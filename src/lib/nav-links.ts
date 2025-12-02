export const navItems = [
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#portfolio" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export type NavItem = (typeof navItems)[number];
