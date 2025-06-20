# TinaCMS Workflow Notes - Built By Tom

## 🎉 SUCCESS! Complete Working Demo
- **Live Site**: https://rococo-cucurucho-2a05c3.netlify.app
- **CMS Admin**: https://rococo-cucurucho-2a05c3.netlify.app/admin/
- **GitHub Repo**: https://github.com/builtbytom/fuego-tacos

## Overview
Setting up TinaCMS as the standard CMS solution for Built By Tom client projects. Zero monthly fees for clients, professional editing experience.

## Current Demo Sites
1. Coffee Shop
2. Video Game Site (Crew Motorfest)
3. Bookkeeper
4. Photographer
5. Event Planning Business
6. Fuego Street Tacos (Modern Taco Shop) - IN PROGRESS

## TinaCMS Setup Process

### Why TinaCMS?
- Git-based (works with Netlify free tier)
- Visual editing directly on the website
- No monthly fees for self-hosted version
- Clients edit in context - see changes live
- Professional UX without the cost

### Authentication Strategy
- Use TinaCMS Cloud free tier (2 users per project)
- One Built By Tom account manages all client projects
- Clients can upgrade if they need more users

### Technical Stack
- Astro (preferred for content sites - faster performance)
- Next.js (for more interactive/app-like sites)
- TinaCMS for content management
- GitHub for version control
- Netlify for hosting
- All on free tiers

## Demo Project Plan
- [x] Choose business type for 6th demo: Modern Taco Shop - "Fuego Street Tacos"
- [x] Set up fresh Astro project (better performance for restaurant sites)
- [x] Install and configure TinaCMS from day 1
- [ ] Build with CMS-first approach
- [ ] Create client training materials
- [ ] Document the entire process

## Project Structure Created
- Astro + TypeScript setup
- TinaCMS configured with:
  - Menu items collection
  - Daily specials collection
  - Pages collection
  - Global site settings
- Content directories created
- Sample menu items added
- Image optimization strategy implemented
- CMS is customer-proof and professional

## What Makes This Demo Impressive

### Visual Design
- Premium hero with background images and animations
- Psychology-driven headlines ("Crave-Worthy Street Tacos")
- Beautiful food photography throughout
- Hover effects and micro-interactions
- Mobile-responsive design
- Dark/light section contrast

### Technical Excellence  
- Built with Astro (perfect Lighthouse scores)
- TinaCMS integrated from day 1
- Git-based content management
- Automatic image optimization
- Zero monthly CMS fees
- Customer-proof editing

### Business Value
- Clients can update menu prices instantly
- Add/remove items without calling developer
- Change hours, specials, etc.
- Can't break the design
- All changes tracked in Git
- Automatic deployment on save

## Key URLs & Resources

### Development URLs
- Local site: http://localhost:4321
- Local CMS: http://localhost:4001/admin/
- Live demo: https://rococo-cucurucho-2a05c3.netlify.app
- Live CMS: https://rococo-cucurucho-2a05c3.netlify.app/admin/

### Documentation
- TinaCMS Docs: https://tina.io/docs
- Astro Docs: https://docs.astro.build
- This workflow: Successfully used for Fuego Tacos demo

### Image Resources
- Unsplash for demo images
- Astro `<Image>` component for optimization
- Netlify auto-optimizes on CDN

## Common Issues & Solutions

### "Page not found" on /admin
- Make sure build command includes `tinacms build`
- Check environment variables are set in Netlify
- Verify Site URL in TinaCMS project settings

### Can't see content in CMS
- Check tina/config.ts matches your content structure
- Ensure .md files have proper frontmatter
- Verify collections are defined correctly

### Local dev issues
- TinaCMS runs on port 4001, not 4321
- Use `npm run dev` not `npm start`
- Check .env file has credentials

## Complete Setup Process (Proven & Working)

### 1. Local Development Setup
```bash
# Create Astro project
npm create astro@latest
# Choose: Minimal, TypeScript

# Install TinaCMS
npm install --save-dev tinacms @tinacms/cli

# Install Tailwind (optional but recommended)
npm install -D tailwindcss @astrojs/tailwind
```

### 2. Configure TinaCMS
Create `tina/config.ts` with collections for:
- Menu items
- Daily specials  
- Site settings
- Pages

### 3. Update package.json
```json
"scripts": {
  "dev": "tinacms dev -c \"astro dev\"",
  "build": "tinacms build && astro build"
}
```

### 4. Create Content Structure
```
src/content/
├── menu/       # Individual menu items
├── specials/   # Daily specials
├── settings/   # Site configuration
└── pages/      # Static pages
```

### 5. Deploy to Netlify
- Push to GitHub
- Connect Netlify to repo
- Deploy with build command: `npm run build`
- Publish directory: `dist`

### 6. Set Up TinaCMS Cloud
1. Create account at app.tina.io
2. Create project → Custom Project → Import your Site
3. Connect to GitHub repo
4. Get credentials:
   - Client ID: `676bc91d-6047-4912-8a37-bae8221ec869`
   - Token: `17fdf18eb5d478ba34633a4ed5af58eec48176f3`

### 7. Add Environment Variables to Netlify
```
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
```

### 8. Trigger Redeploy
Push any small change to trigger rebuild with env vars

## Client Handoff Process

### 1. Demo the CMS
- Show them editing a menu item
- Change a price, save, watch it deploy
- Demonstrate they can't "break" anything
- Show version history in GitHub

### 2. Provide Access
- Add client as user in TinaCMS project
- They get email invitation
- Simple login with GitHub or email

### 3. Training Points
- "Your changes save automatically"
- "Site updates in about 60 seconds"
- "You can always undo changes"
- "Upload images directly - we handle optimization"

### 4. Support
- Include 30 days of support in package
- Create simple video walkthrough
- Provide cheat sheet PDF

## Pricing Strategy
- $3,500 for complete site with CMS
- Includes TinaCMS setup and training
- No monthly fees (huge selling point)
- Optional maintenance packages available