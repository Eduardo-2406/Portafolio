# 🎯 Quick Setup Guide

This guide will help you customize your portfolio in **5 simple steps**.

---

## ✅ Step 1: Install Dependencies

```bash
npm install
```

---

## ✅ Step 2: Configure Environment Variables

### Create `.env.local` file in the root directory:

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

### How to get Resend API Key:

1. Visit [resend.com](https://resend.com)
2. Sign up for free account
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `re_`)
6. Paste it in `.env.local`

### Set your email:

Replace `your-email@example.com` with the email where you want to receive contact form messages.

---

## ✅ Step 3: Add Your Content

### Edit `src/lib/data.ts`:

#### 3.1 Update Social Links

```typescript
export const socialLinks = {
  github: "https://github.com/YOUR_USERNAME",
  linkedin: "https://linkedin.com/in/YOUR_USERNAME",
  whatsapp: "https://wa.me/YOUR_PHONE_NUMBER",
  cv: "/cv.pdf", // After adding cv.pdf to /public/
};
```

#### 3.2 Update Skills

```typescript
export const skills: Skill[] = [
  { name: "JavaScript", level: 70 }, // 0-100
  { name: "React", level: 80 },
  // Add your skills...
];
```

**Skill Levels:**

- `0-29` = Basic
- `30-49` = Basic+
- `50-100` = Intermediate

#### 3.3 Update Your Name and Title

Edit `src/components/sections/about-section.tsx`:

```typescript
// CUSTOMIZATION: Change these values to personalize your portfolio
const name = "Eduardo"; // Your name
const title = "Frontend Developer"; // Your job title
```

Also update the description in the same file:

```typescript
const description = "I love building digital solutions..."; // Your bio
```

#### 3.4 Update Projects

```typescript
export const projects: Project[] = [
  {
    id: "my-project",
    title: "My Awesome Project",
    description: "What this project does...",
    image: "my-project", // Filename without extension
    tags: ["React", "Next.js"],
    liveUrl: "https://my-project.com",
    githubUrl: "https://github.com/username/project",
  },
  // Add more projects...
];
```

---

## ✅ Step 4: Add Project Images

1. Go to `/public/projects/` folder
2. Add your project images:
   - `project1.jpg` or `project1.png`
   - `project2.jpg` or `project2.png`
   - etc.
3. **Recommended size:** 1200x800px
4. **Supported formats:** `.jpg`, `.png`, `.webp`

---

## ✅ Step 5: Add Your CV (Optional)

1. Place your CV file in `/public/cv.pdf`
2. The download button will work automatically

If you don't have a CV yet, leave it as `cv: '#'` in `data.ts`.

---

## 🚀 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🌐 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your repository
5. Add environment variables:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
6. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 🎨 Customization (Optional)

### Change Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 174 25% 48%; /* Your brand color */
}
```

### Change Fonts

Edit `src/app/layout.tsx`:

```typescript
import { Your_Font } from "next/font/google";
```

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] Updated all content in `src/lib/data.ts`
- [ ] Added `RESEND_API_KEY` to `.env.local`
- [ ] Added `CONTACT_EMAIL` to `.env.local`
- [ ] Added project images to `/public/projects/`
- [ ] Added CV to `/public/cv.pdf` (optional)
- [ ] Tested contact form locally
- [ ] Ran `npm run build` successfully
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel
- [ ] Tested contact form in production
- [ ] Ran Lighthouse test (should be 95-100)

---

## 🆘 Common Issues

### Contact Form Not Working

**Problem:** Form submits but no email received

**Solution:**

1. Check `.env.local` has correct `RESEND_API_KEY`
2. Verify `CONTACT_EMAIL` is your email
3. Check Resend dashboard for delivery status
4. Make sure environment variables are set in Vercel

### Images Not Loading

**Problem:** Project images show as broken

**Solution:**

1. Check images are in `/public/projects/`
2. Verify filename matches exactly (case-sensitive)
3. Use supported formats: `.jpg`, `.png`, `.webp`
4. Check `image` field in `data.ts` matches filename

### Build Errors

**Problem:** `npm run build` fails

**Solution:**

```bash
# Delete cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Need More Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review code comments in `src/lib/data.ts`
- Review code comments in `src/app/actions.ts`

---

**🎉 That's it! Your portfolio is ready to go live!**
