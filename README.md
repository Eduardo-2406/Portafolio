# Modern Portfolio Template

A high-performance, fully responsive portfolio template built with Next.js 16, TypeScript, and Tailwind CSS.

## Performance Metrics

- Performance: 95%
- Accessibility: 100%
- Best Practices: 100%
- SEO: 100%

## Features

- High-performance Next.js 16 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion animations
- Dark/Light mode with system preference detection
- Fully responsive design
- Contact form with Resend integration
- Optimized for production (code splitting, lazy loading)
- 95% PageSpeed Insights score

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **UI Components**: Radix UI

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

```bash
# Install dependencies
npm install

# Create environment file
# Add your Resend API key and email
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### Environment Variables

Create `.env.local` file:

```env
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your-email@example.com
```

Get your free Resend API key at [resend.com](https://resend.com)

## Customization

### Update Your Information

Edit `src/lib/data.ts` to customize:

- Social media links
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

1. Place images in `/public/projects/`
2. Supported formats: JPG, PNG, WebP
3. Recommended size: 1200x800px
4. Update references in `src/lib/data.ts`

## Build and Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

Your portfolio will be live in minutes.

## Documentation

- **INSTALLATION.md** - Detailed installation guide
- **CHANGELOG.md** - Version history
- **LICENSE.txt** - License information

## Project Structure

```
portfolio-template/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities and data
│   └── hooks/           # Custom hooks
├── public/              # Static files
└── INSTALLATION.md      # Detailed setup guide
```

## Browser Support

- Chrome 109+
- Safari 16+
- Firefox 115+
- Edge 109+

## License

See LICENSE.txt for license information.

## Support

For installation help, see INSTALLATION.md

For questions or support, contact: juniormendoza537@gmail.com

---

Built with Next.js, TypeScript, and Tailwind CSS
