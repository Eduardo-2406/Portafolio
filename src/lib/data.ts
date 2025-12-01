/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONFIGURATION FILE - CUSTOMIZE YOUR PORTFOLIO HERE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This file contains all the content for your portfolio.
 * Update the values below with your own information.
 * 
 * IMPORTANT: After making changes, restart your dev server (npm run dev)
 */

import type { TechName } from '@/components/tech-icon';

export type Skill = {
  name: TechName;
  level: number; // 0-100: 0-29 = Basic, 30-49 = Basic+, 50-100 = Intermediate
};

export type Project = {
  id: string;          // Unique identifier (e.g., 'proj1', 'proj2')
  title: string;       // Project name
  description: string; // Brief description of the project
  image: string;       // Image filename (without extension) in /public/projects/
  tags: TechName[];    // Technologies used (must match available tech icons)
  liveUrl: string;     // Live demo URL or '#' if not available
  githubUrl: string;   // GitHub repository URL or '#' if private
};

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROJECTS - Add your projects here
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * HOW TO ADD PROJECTS:
 * 1. Add your project image to /public/projects/ (e.g., project1.jpg)
 * 2. Add a new object to the array below
 * 3. Fill in all the fields
 * 
 * EXAMPLE:
 * {
 *   id: 'my-project',
 *   title: 'My Awesome Project',
 *   description: 'A brief description of what this project does...',
 *   image: 'my-project',  // Filename without extension
 *   tags: ['React', 'Next.js', 'Tailwind CSS'],
 *   liveUrl: 'https://my-project.com',
 *   githubUrl: 'https://github.com/username/project',
 * }
 */
export const projects: Project[] = [
  {
    id: 'proj1',
    title: 'Kolping Inventory System',
    description:
      'Professional practice academic project: an inventory platform designed to optimize internal management for Kolping, reducing errors from manual information handling and offering a clearer, more reliable view of their operations.',
    image: 'project1', // Image: /public/projects/project1.jpg
    tags: ['C#', 'SQL Server'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj2',
    title: 'Web Cafeteria',
    description:
      'Academic web cafeteria project that digitalizes orders and billing: customers place orders online and receive PDF invoices via email, while staff manage and update order statuses from a centralized dashboard.',
    image: 'project2', // Image: /public/projects/project2.jpg
    tags: ['PHP', 'Sass', 'JavaScript', 'MySQL'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj3',
    title: 'Cybersecurity Platform',
    description:
      'Educational cybersecurity platform developed as a thesis project for a company, focused on vulnerabilities, strengthening employee knowledge, awareness, and cybersecurity culture, helping the company reinforce its technological infrastructure, inspired by best practices like the NIST framework.',
    image: 'project3', // Image: /public/projects/project3.jpg
    tags: ['React', 'Tailwind CSS', 'Firebase', 'JavaScript', 'HTML5', 'CSS', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SKILLS - Add your technical skills here
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * SKILL LEVELS:
 * - 0-29:   Basic
 * - 30-49:  Basic+ (transitioning to intermediate)
 * - 50-100: Intermediate
 * 
 * AVAILABLE TECHNOLOGIES (TechName):
 * Frontend: 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS'
 * Backend: 'Node.js', 'Firebase', 'PostgreSQL', 'C#', 'SQL Server'
 * Others: Check src/components/tech-icon.tsx for full list
 * 
 * EXAMPLE:
 * { name: 'React', level: 75 },  // Intermediate
 */
export const skills: Skill[] = [
  { name: 'JavaScript', level: 30 },
  { name: 'React', level: 15 },
  { name: 'Next.js', level: 15 },
  { name: 'Node.js', level: 15 },
  { name: 'Tailwind CSS', level: 45 },
  { name: 'Firebase', level: 15 },
  { name: 'HTML5', level: 60 },
  { name: 'CSS', level: 60 },
  { name: 'PostgreSQL', level: 25 },
  { name: 'C#', level: 20 },
  { name: 'SQL Server', level: 25 },
] as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOCIAL LINKS - Update with your social media profiles
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * INSTRUCTIONS:
 * - Replace '#' with your actual URLs
 * - For CV: Place your cv.pdf file in /public/ folder and change to '/cv.pdf'
 * - For WhatsApp: Use format 'https://wa.me/1234567890' (with country code)
 * 
 * EXAMPLES:
 * github: 'https://github.com/yourusername'
 * linkedin: 'https://linkedin.com/in/yourusername'
 * whatsapp: 'https://wa.me/521234567890'  // Mexico example
 * cv: '/cv.pdf'  // After placing cv.pdf in /public/
 */
export const socialLinks = {
  github: '#',      // ⚠️ CHANGE: Your GitHub profile URL
  linkedin: '#',    // ⚠️ CHANGE: Your LinkedIn profile URL
  whatsapp: '#',    // ⚠️ CHANGE: Your WhatsApp link (https://wa.me/number)
  cv: '#',          // ⚠️ CHANGE: '/cv.pdf' after adding your CV to /public/
} as const;

export type SocialPlatform = keyof typeof socialLinks;
