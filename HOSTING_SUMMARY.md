# Hosting Impact Summary

## Quick Answer

✅ **Yes, the monorepo structure impacts hosting, but it's fully supported.**

Both apps are deployed **separately** to different URLs, but they:
- Share the same database (Neon PostgreSQL)
- Share the same workspace packages (`@tayo/database`, `@tayo/components`)
- Deploy independently with their own domains

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         Neon Database (PostgreSQL)          │
│         Hosted: cloud.neon.tech             │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│  Client App   │     │  Admin App    │
│  Next.js 16   │     │  Next.js 16   │
├───────────────┤     ├───────────────┤
│ Hosted: Vercel│     │ Hosted: Vercel│
│ URL: main site│     │ URL: /admin   │
└───────────────┘     └───────────────┘
```

---

## What Gets Deployed Where

### 1. Database - Neon (Cloud)
- **What**: PostgreSQL database
- **Where**: Neon serverless infrastructure
- **Cost**: Free tier → ~$19-69/month
- **Setup**: Already done ✅

### 2. Client App - Vercel
- **What**: Customer-facing website
- **Where**: Vercel edge network
- **URL Examples**:
  - Production: `uptownnutrition.com`
  - Preview: `uptown-nutrition-git-main.vercel.app`
- **Cost**: Free (or $20/month for Pro features)

### 3. Admin App - Vercel
- **What**: Admin dashboard
- **Where**: Vercel edge network (separate project)
- **URL Examples**:
  - Production: `admin.uptownnutrition.com`
  - Preview: `uptown-admin-git-main.vercel.app`
- **Cost**: Free (or $20/month for Pro features)

---

## Deployment Process

### One-Time Setup (Per App)

```bash
# Deploy client
cd client
vercel --prod

# Deploy admin
cd admin
vercel --prod
```

### Continuous Deployment (Automatic)

1. Push code to GitHub
2. Vercel automatically deploys both apps
3. Each app builds independently
4. Both connect to same database

---

## Key Configuration Files Created

✅ `/client/vercel.json` - Client deployment config
✅ `/admin/vercel.json` - Admin deployment config
✅ `/client/.env.example` - Client environment template
✅ `/admin/.env.example` - Admin environment template
✅ `DEPLOYMENT_GUIDE.md` - Full deployment instructions

---

## How Monorepo Works with Hosting

### Build Process

When Vercel builds the client app:
```bash
1. cd .. (go to monorepo root)
2. bun install (install ALL workspace packages)
3. bun run build:client (build client app specifically)
4. Deploy client/.next folder
```

When Vercel builds the admin app:
```bash
1. cd .. (go to monorepo root)
2. bun install (install ALL workspace packages)
3. bun run build:admin (build admin app specifically)
4. Deploy admin/.next folder
```

### Shared Code

Both apps include the database package because:
- `package.json` dependencies: `"@tayo/database": "workspace:*"`
- Build command installs from monorepo root
- Vercel bundles the entire workspace

This is **normal and expected** for monorepos!

---

## Environment Variables

Each app needs its **own environment variables** in Vercel:

### Client App (Set in Vercel Dashboard)
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=...
```

### Admin App (Set in Vercel Dashboard)
```env
DATABASE_URL=postgresql://... (SAME database)
NEXTAUTH_SECRET=... (can be same or different)
```

---

## Domain Setup

### Recommended Structure

- **Client**: `uptownnutrition.com`
- **Admin**: `admin.uptownnutrition.com`

### DNS Configuration (in your domain registrar)

```
A record:     uptownnutrition.com → Vercel IP
CNAME record: admin.uptownnutrition.com → cname.vercel-dns.com
```

Vercel provides these values when you add a custom domain.

---

## Cost Breakdown

### Development (Free)
- Neon: Free tier (0.5GB storage)
- Vercel Client: Free
- Vercel Admin: Free
- **Total: $0/month**

### Production (Recommended)
- Neon Scale: ~$19-69/month
- Vercel Pro (both apps): $40/month
- Domain: ~$12/year
- **Total: ~$60-110/month**

### Enterprise
- Neon Business: Custom pricing
- Vercel Enterprise: Custom pricing
- **Total: Custom**

---

## Performance Impact

### ✅ No Performance Impact

The monorepo structure does **NOT** affect runtime performance:
- Only affects build time (minimal)
- Both apps are deployed as optimized bundles
- No extra overhead in production
- Database connection is serverless (scales automatically)

### Build Time Comparison

**Monorepo (current)**:
- Client build: ~2-3 minutes
- Admin build: ~2-3 minutes
- **Total**: ~5-6 minutes (parallel)

**Separate Repos**:
- Client build: ~1-2 minutes
- Admin build: ~1-2 minutes
- **Total**: ~3-4 minutes (parallel)

The ~1-2 minute difference is negligible for most use cases.

---

## Advantages of This Setup

1. ✅ **Shared Database Schema** - Single source of truth
2. ✅ **Shared Components** - Reusable UI components
3. ✅ **Type Safety** - Shared TypeScript types
4. ✅ **Atomic Deployments** - Deploy both apps after schema changes
5. ✅ **Independent Scaling** - Each app scales separately
6. ✅ **Cost Effective** - One database for both apps

---

## Migration Path (If Needed Later)

If you later decide to separate the apps:

1. Extract database package to npm registry
2. Deploy as separate GitHub repos
3. Install `@uptownnutrition/database` from npm
4. Same code, just different distribution

But for now, **the monorepo is the best choice** for this project.

---

## Summary

**Does monorepo impact hosting?**
→ Yes, but positively! You get:
- Shared codebase advantages
- Independent deployment flexibility
- Same hosting costs as separate apps
- No performance penalty

**Ready to deploy?**
→ See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.
