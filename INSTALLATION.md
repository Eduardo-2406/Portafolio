# Installation Guide

## System Requirements

Before installing, ensure your system meets these requirements:

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm (included with Node.js) or pnpm
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB recommended
- **Disk Space**: At least 500MB free space

## Installation Steps

### Step 1: Extract Files

Extract the downloaded ZIP file to your desired location.

```bash
# Example location
C:\Projects\my-portfolio
# or
~/Projects/my-portfolio
```

### Step 2: Navigate to Project Directory

Open your terminal or command prompt and navigate to the extracted folder:

```bash
cd path/to/my-portfolio
```

### Step 3: Install Dependencies

Install all required packages using npm:

```bash
npm install
```

This process may take 2-5 minutes depending on your internet connection.

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required for contact form functionality
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your-email@example.com
```

**How to obtain Resend API Key:**

1. Visit https://resend.com
2. Create a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (starts with `re_`)
6. Paste it in your `.env.local` file

**Note:** The free tier includes 100 emails per day, which is sufficient for most portfolios.

### Step 5: Verify Installation

Run the development server to verify everything is working:

```bash
npm run dev
```

Open your browser and navigate to http://localhost:3000

You should see the portfolio template running successfully.

## Customization

### Update Personal Information

Edit `src/lib/data.ts` to add your:

- Social media links (GitHub, LinkedIn, WhatsApp)
- Skills and proficiency levels
- Project portfolio
- Contact information

### Update Name and Title

Edit `src/components/sections/about-section.tsx`:

```typescript
const name = "Your Name";
const title = "Your Professional Title";
const description = "Your professional bio...";
```

### Add Project Images

1. Place your project images in `/public/projects/`
2. Supported formats: JPG, PNG, WebP
3. Recommended size: 1200x800 pixels
4. Update image references in `src/lib/data.ts`

### Add Your CV (Optional)

Place your CV file as `/public/cv.pdf`

The download button will automatically link to this file.

## Building for Production

### Create Production Build

```bash
npm run build
```

This command:

- Optimizes all code and assets
- Generates static pages
- Creates production-ready bundle
- Typically takes 1-3 minutes

### Test Production Build Locally

```bash
npm run build
npm start
```

Visit http://localhost:3000 to test the production build.

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform for Next.js applications.

**Method 1: GitHub Integration**

1. Push your code to a GitHub repository
2. Visit https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add `RESEND_API_KEY`
   - Add `CONTACT_EMAIL`
6. Click "Deploy"

Your site will be live in approximately 2-3 minutes.

**Method 2: Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

This template can be deployed to any platform supporting Node.js:

- **Netlify**: Connect GitHub repository
- **AWS Amplify**: Use AWS Console
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Use GitHub integration

Refer to Next.js deployment documentation for platform-specific instructions:
https://nextjs.org/docs/deployment

## Troubleshooting

### Installation Issues

**Problem:** `npm install` fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules if exists
rm -rf node_modules

# Reinstall
npm install
```

### Build Errors

**Problem:** `npm run build` fails with TypeScript errors

**Solution:**

1. Ensure all required files are present
2. Check for syntax errors in modified files
3. Verify Node.js version is 18.x or higher
4. Delete `.next` folder and rebuild

### Contact Form Not Working

**Problem:** Form submits but no email received

**Solution:**

1. Verify `RESEND_API_KEY` is correctly set in `.env.local`
2. Check `CONTACT_EMAIL` is your valid email address
3. Ensure environment variables are added to Vercel (if deployed)
4. Check Resend dashboard for delivery logs
5. Verify you haven't exceeded free tier limits

### Images Not Displaying

**Problem:** Project images show as broken

**Solution:**

1. Confirm images are in `/public/projects/` directory
2. Verify filenames match exactly (case-sensitive)
3. Check image format is supported (JPG, PNG, WebP)
4. Ensure image field in `src/lib/data.ts` matches filename without extension

### Performance Issues in Development

**Problem:** Animations are choppy or slow

**Solution:**

This is normal in development mode. Animations are optimized for production.

Test with production build:

```bash
npm run build
npm start
```

## Performance Optimization

The template is pre-optimized for maximum performance:

- 95% PageSpeed Insights score
- Code splitting and lazy loading
- Optimized images (AVIF/WebP)
- Font optimization
- Minimal JavaScript bundle

To maintain optimal performance:

1. Compress images before adding them
2. Use WebP format when possible
3. Keep dependencies updated
4. Avoid adding heavy third-party scripts
5. Test with Lighthouse after major changes

## Getting Help

If you encounter issues not covered in this guide:

1. Review the main README.md file
2. Check code comments in source files
3. Verify all steps were followed correctly
4. Contact support: juniormendoza537@gmail.com

## Next Steps

After successful installation:

1. Customize all content in `src/lib/data.ts`
2. Add your project images
3. Test contact form locally
4. Run production build
5. Deploy to Vercel
6. Test live site
7. Run Lighthouse audit

Congratulations! Your professional portfolio is ready to go live.
