# Deployment Guide - Monorepo Hosting

## Architecture Overview

```
Neon Database (PostgreSQL)
         ↓
    DATABASE_URL
    ↙         ↘
Client App    Admin App
(Vercel)      (Vercel)
```

Both apps are deployed **separately** but connect to the **same database**.

---

## Hosting Options

### Option 1: Vercel (Recommended)
✅ Best Next.js support
✅ Native monorepo support
✅ Free tier available
✅ Automatic deployments from Git

### Option 2: Netlify
✅ Monorepo support
✅ Good Next.js support
⚠️ Requires build configuration

### Option 3: Railway / Render
✅ Monorepo support
✅ Docker-based deployment
⚠️ More complex setup

---

## Deployment Strategy

### 1. Database (Neon)
- **Hosting**: Neon (already cloud-hosted)
- **Environments**:
  - Production branch
  - Staging branch (optional)
  - Development branch (optional)
- **Cost**: Free tier available, scales with usage

### 2. Client App
- **URL**: `https://uptownnutrition.com` (or your domain)
- **Platform**: Vercel recommended
- **Environment**: Production
- **Build Command**: `cd ../.. && bun run build:client`
- **Output Directory**: `client/.next`

### 3. Admin App
- **URL**: `https://admin.uptownnutrition.com` (or subdomain)
- **Platform**: Vercel recommended
- **Environment**: Production
- **Build Command**: `cd ../.. && bun run build:admin`
- **Output Directory**: `admin/.next`

---

## Vercel Configuration

### Project Setup

Both apps need separate Vercel projects:

#### Client App (`vercel.json` in `/client`)
```json
{
  "buildCommand": "cd .. && bun install && bun run build:client",
  "devCommand": "bun run dev",
  "installCommand": "cd .. && bun install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### Admin App (`vercel.json` in `/admin`)
```json
{
  "buildCommand": "cd .. && bun install && bun run build:admin",
  "devCommand": "bun run dev",
  "installCommand": "cd .. && bun install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables (Set in Vercel Dashboard)

**Client App Environment Variables:**
```env
DATABASE_URL=postgresql://...neon.tech/...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://uptownnutrition.com
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLIENT_URL=https://uptownnutrition.com
NEXT_PUBLIC_ADMIN_URL=https://admin.uptownnutrition.com
```

**Admin App Environment Variables:**
```env
DATABASE_URL=postgresql://...neon.tech/...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://admin.uptownnutrition.com
NEXT_PUBLIC_CLIENT_URL=https://uptownnutrition.com
NEXT_PUBLIC_ADMIN_URL=https://admin.uptownnutrition.com
```

---

## Vercel Deployment Steps

### 1. Deploy Client App

```bash
# From root directory
cd client
vercel
# Follow prompts:
# - Link to existing project? No
# - Project name: uptown-nutrition-client
# - Which directory: ./
# - Override settings? Yes
# - Build Command: cd .. && bun install && bun run build:client
# - Output Directory: .next
# - Development Command: bun run dev
```

### 2. Deploy Admin App

```bash
# From root directory
cd admin
vercel
# Follow prompts:
# - Link to existing project? No
# - Project name: uptown-nutrition-admin
# - Which directory: ./
# - Override settings? Yes
# - Build Command: cd .. && bun install && bun run build:admin
# - Output Directory: .next
# - Development Command: bun run dev
```

### 3. Set Environment Variables

For each project in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required variables (see above)
3. Set for Production, Preview, and Development environments

### 4. Configure Domains

**Client App:**
- Production: `uptownnutrition.com`
- Preview: `uptown-nutrition-client.vercel.app`

**Admin App:**
- Production: `admin.uptownnutrition.com`
- Preview: `uptown-nutrition-admin.vercel.app`

---

## Monorepo Build Considerations

### Why Build Commands Reference Parent Directory

```bash
cd .. && bun install && bun run build:client
```

This is necessary because:
1. Workspace packages (`@tayo/database`, `@tayo/components`) are in the monorepo root
2. `bun install` needs to run from root to resolve workspace dependencies
3. Build command then runs the specific app build

### Package Dependencies

The hosting platform needs to:
1. ✅ Install all workspace dependencies
2. ✅ Build shared packages first
3. ✅ Then build the specific app

Vercel handles this automatically when using the correct build command.

---

## Database Migration Strategy

### Before Deploying

```bash
# Push schema to production database
DATABASE_URL="postgresql://prod-db..." bun run db:push
```

### Continuous Deployment

1. **Schema changes** → Commit to git
2. **Generate migration** → `bun run db:generate`
3. **Review migration** → Check `database/drizzle` folder
4. **Deploy apps** → Vercel auto-deploys on git push
5. **Run migration** → Manual or CI/CD (see below)

### CI/CD Migration (GitHub Actions example)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Cost Breakdown

### Free Tier (Getting Started)
- **Neon Database**: Free (0.5 GB storage, 1 compute hour/month)
- **Vercel Client**: Free (unlimited deployments)
- **Vercel Admin**: Free (unlimited deployments)
- **Total**: $0/month

### Paid Tier (Production)
- **Neon Database**: ~$19-69/month (depends on usage)
- **Vercel Pro (2 projects)**: $40/month ($20 per project)
- **Domain**: ~$12/year
- **Total**: ~$60-110/month + domain

---

## Testing Deployments

### Preview Deployments (Free on Vercel)

Every git push creates preview URLs:
- Client: `https://uptown-nutrition-client-git-feature.vercel.app`
- Admin: `https://uptown-nutrition-admin-git-feature.vercel.app`

You can test features before merging to production.

### Using Neon Branches for Testing

1. Create database branch: `staging`
2. Get branch connection string
3. Set `DATABASE_URL` for preview deployments
4. Test with isolated data

---

## Security Considerations

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variable encryption
- ✅ Different secrets for dev/staging/prod

### Database Access
- ✅ Only server-side code can access database
- ✅ Use Neon's IP allowlisting (optional)
- ✅ Rotate credentials regularly

### Admin Access
- ✅ Deploy admin to separate domain/subdomain
- ✅ Add authentication middleware
- ✅ Restrict admin access by IP (optional)

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Cannot find module '@tayo/database'`

**Solution**: Ensure build command includes `cd .. && bun install`

### Database Connection Issues

**Error**: `Failed to connect to database`

**Solution**:
1. Check `DATABASE_URL` is set in Vercel environment variables
2. Verify Neon database is running
3. Check connection string format

### Monorepo Workspace Issues

**Error**: `Package not found in workspace`

**Solution**: Build from root directory, not subdirectory

---

## Next Steps

1. ✅ Set up Neon database (already done)
2. ⏭️ Create Vercel account
3. ⏭️ Deploy client app
4. ⏭️ Deploy admin app
5. ⏭️ Configure custom domains
6. ⏭️ Set up CI/CD (optional)
