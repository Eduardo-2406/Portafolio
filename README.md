# 🚀 Modern Developer Portfolio Template

A stunning, high-performance portfolio template built with Next.js 16, TypeScript, and Tailwind CSS. Perfect for developers who want to showcase their work with style.

## ✨ Features

- ⚡ **100% Performance Score** - Optimized for speed with Lighthouse
- 🎨 **Modern Design** - Clean, professional UI with smooth animations
- 🌓 **Dark/Light Mode** - Seamless theme switching
- 📱 **Fully Responsive** - Perfect on all devices (mobile, tablet, desktop)
- ♿ **Accessible** - 100% Accessibility score
- 🔍 **SEO Optimized** - 100% SEO score
- 🎭 **Smooth Animations** - GPU-accelerated animations with Framer Motion
- 📧 **Contact Form** - Integrated with Resend for email delivery
- 🎯 **Type-Safe** - Built with TypeScript
- 🚀 **Easy to Deploy** - One-click deploy to Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or pnpm package manager
- A Resend account (for contact form) - [Get free API key](https://resend.com)
- A Vercel account (for deployment) - [Sign up free](https://vercel.com)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-template.git
cd portfolio-template
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Resend API Key for contact form
RESEND_API_KEY=your_resend_api_key_here

# Your email address to receive contact form messages
CONTACT_EMAIL=your-email@example.com
```

**How to get your Resend API Key:**

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it in your `.env.local` file

**Set your contact email:**

Replace `your-email@example.com` with the email address where you want to receive contact form submissions.

### 4. Customize Your Content

#### Update Personal Information

Edit `src/lib/data.ts`:

```typescript
export const socialLinks = {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  whatsapp: "https://wa.me/1234567890",
  cv: "/cv.pdf", // Place your CV in /public/cv.pdf
} as const;
```

#### Update Your Name and Title

Edit `src/components/sections/about-section.tsx`:

```typescript
// CUSTOMIZATION: Change these values to personalize your portfolio
const name = "Eduardo"; // Your name
const title = "Frontend Developer"; // Your job title
```

**What to change:**

- `name`: Your first name or full name (appears in large animated text)
- `title`: Your professional title (appears below with typing animation)

**Example:**

```typescript
const name = "Sarah";
const title = "Full Stack Developer";
```

#### Update About Description

In `src/components/sections/about-section.tsx`, find and update:

```typescript
const description = "I love building digital solutions...";
```

Replace with your own professional description.

#### Update Skills

In `src/lib/data.ts`, modify the skills array:

```typescript
export const skills: Skill[] = [
  { name: "JavaScript", level: 60 }, // level: 0-100
  { name: "React", level: 70 },
  // Add your skills here
];
```

**Skill levels:**

- `0-29`: Basic
- `30-49`: Basic+
- `50-100`: Intermediate

#### Update Projects

In `src/lib/data.ts`, modify the projects array:

```typescript
export const projects: Project[] = [
  {
    id: "proj1",
    title: "Your Project Name",
    description: "Project description...",
    image: "project1", // Image filename in /public/projects/
    tags: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "https://your-project.com",
    githubUrl: "https://github.com/yourusername/project",
  },
  // Add more projects
];
```

**Project Images:**

- Place your project images in `/public/projects/`
- Supported formats: `.jpg`, `.png`, `.webp`
- Recommended size: 1200x800px
- Name them: `project1.jpg`, `project2.png`, etc.

### 5. Add Your CV (Optional)

1. Place your CV file in `/public/cv.pdf`
2. The download button will automatically work

If you don't have a CV yet, the button will still appear but won't download anything (it's set to `#`).

### 6. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `RESEND_API_KEY`: Your Resend API key
6. Click "Deploy"

Your portfolio will be live in minutes! 🎉

### Environment Variables in Vercel

In your Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add: `RESEND_API_KEY` = `your_api_key_here`
3. Redeploy your project

## 🎨 Customization Guide

### Change Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 174 25% 48%; /* Main accent color */
  --foreground: 222 47% 16%; /* Text color */
  /* Modify other colors as needed */
}
```

### Change Fonts

Edit `src/app/layout.tsx`:

```typescript
import { Your_Font } from "next/font/google";

const yourFont = Your_Font({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-your-font",
  display: "optional",
});
```

### Modify Animations

Animations are in individual component files. Look for:

- `src/components/sections/` - Section animations
- `src/styles/loader.css` - Loading animation
- Framer Motion variants in component files

## 📁 Project Structure

```
portfolio-template/
├── public/              # Static files
│   ├── projects/        # Project images
│   └── cv.pdf          # Your CV (add this)
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── actions.ts  # Server actions (contact form)
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Main page
│   ├── components/     # React components
│   │   ├── sections/   # Page sections
│   │   ├── ui/         # UI components
│   │   └── layout/     # Layout components
│   ├── lib/            # Utilities
│   │   └── data.ts     # ⚠️ YOUR CONTENT HERE
│   ├── hooks/          # Custom hooks
│   └── styles/         # Additional styles
├── .env.local          # ⚠️ Environment variables (create this)
└── next.config.ts      # Next.js configuration
```

## 🔧 Configuration Files to Customize

### Must Change:

1. ✅ `src/components/sections/about-section.tsx` - Your name, title, and description
2. ✅ `src/lib/data.ts` - Your content (skills, projects, links)
3. ✅ `.env.local` - Your Resend API key and contact email
4. ✅ `/public/projects/` - Your project images
5. ✅ `/public/cv.pdf` - Your CV file

### Optional:

- `src/app/globals.css` - Colors and theme
- `src/app/layout.tsx` - Fonts and metadata
- `tailwind.config.ts` - Tailwind customization

## 📧 Contact Form Setup

The contact form uses [Resend](https://resend.com) for email delivery.

### Setup Steps:

1. **Get API Key:**

   - Sign up at [resend.com](https://resend.com)
   - Free tier: 100 emails/day, 3,000/month
   - Get your API key from dashboard

2. **Add to Environment:**

   Create `.env.local` file:

   ```env
   RESEND_API_KEY=re_your_key_here
   CONTACT_EMAIL=your-email@example.com
   ```

3. **Test:**
   - Run dev server (`npm run dev`)
   - Fill out contact form
   - Check your email inbox

## 🐛 Troubleshooting

### Contact Form Not Working

**Problem:** Form submits but no email received

**Solution:**

1. Check `RESEND_API_KEY` is set correctly in `.env.local`
2. Verify email address in `src/app/actions.ts`
3. Check Resend dashboard for delivery status
4. Make sure you're not exceeding free tier limits

### Images Not Loading

**Problem:** Project images show broken

**Solution:**

1. Ensure images are in `/public/projects/`
2. Check filename matches exactly (case-sensitive)
3. Supported formats: `.jpg`, `.png`, `.webp`
4. Update `image` field in `src/lib/data.ts`

### Build Errors

**Problem:** `npm run build` fails

**Solution:**

1. Delete `.next` folder and `node_modules`
2. Run `npm install` again
3. Run `npm run build`
4. Check for TypeScript errors in terminal

### Animations Not Smooth

**Problem:** Animations are choppy

**Solution:**

- This is normal in development mode
- Build for production: `npm run build`
- Animations are GPU-accelerated in production

## 📊 Performance Tips

This template is already optimized for 100% Lighthouse score, but here are tips to maintain it:

1. ✅ **Optimize Images:**

   - Use WebP format when possible
   - Compress images before uploading
   - Recommended size: 1200x800px for projects

2. ✅ **Keep Dependencies Updated:**

   ```bash
   npm update
   ```

3. ✅ **Monitor Bundle Size:**

   ```bash
   npm run build
   ```

   Check the output for large chunks

4. ✅ **Test Before Deploy:**
   - Run Lighthouse in production build
   - Test on mobile devices
   - Check all links work

## 📝 License

This template is available for commercial use. You can:

- ✅ Use for personal portfolios
- ✅ Use for client projects
- ✅ Modify and customize
- ✅ Sell websites built with this template

## 🤝 Support

If you encounter any issues:

1. Check this README first
2. Review the troubleshooting section
3. Check the code comments in files
4. Contact support (if purchased with support)

## 🎯 Checklist Before Going Live

- [ ] Updated name and title in `src/components/sections/about-section.tsx`
- [ ] Updated description in `src/components/sections/about-section.tsx`
- [ ] Updated all content in `src/lib/data.ts`
- [ ] Set `RESEND_API_KEY` in `.env.local`
- [ ] Set `CONTACT_EMAIL` in `.env.local`
- [ ] Added project images to `/public/projects/`
- [ ] Added CV to `/public/cv.pdf` (optional)
- [ ] Tested contact form locally
- [ ] Tested on mobile devices
- [ ] Ran `npm run build` successfully
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel
- [ ] Tested live site
- [ ] Ran Lighthouse on production URL

## 🚀 What's Next?

After deployment:

1. Share your portfolio on social media
2. Add the URL to your GitHub profile
3. Include it in your resume
4. Monitor contact form submissions
5. Keep your projects updated

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

Need help? Check the inline comments in the code files for detailed guidance.
