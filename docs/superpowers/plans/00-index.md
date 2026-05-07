# Tayo Platform — Implementation Plan Index

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement each plan.

Plans are independent and can be executed in order or in parallel where noted.

## Execution Order

| # | File | Description | Depends On |
|---|------|-------------|------------|
| 1 | [plan-01-email-package.md](./plan-01-email-package.md) | `@tayo/email` workspace + Resend templates | — |
| 2 | [plan-02-rate-limiting.md](./plan-02-rate-limiting.md) | Upstash rate limiting in both middlewares | — |
| 3 | [plan-03-product-detail.md](./plan-03-product-detail.md) | Product detail page, variant selector, guest cart merge | — |
| 4 | [plan-04-auth-completions.md](./plan-04-auth-completions.md) | Email verification, password reset, transactional emails | 1 |
| 5 | [plan-05-admin-categories-variants.md](./plan-05-admin-categories-variants.md) | Admin categories CRUD + product variants UI | — |
| 6 | [plan-06-admin-users-reviews-audit.md](./plan-06-admin-users-reviews-audit.md) | User mgmt, reviews moderation, audit log viewer | — |
| 7 | [plan-07-admin-dashboard.md](./plan-07-admin-dashboard.md) | Dashboard analytics (today + 30-day charts) | — |
| 8 | [plan-08-client-reviews-search.md](./plan-08-client-reviews-search.md) | Client reviews UI + product search/filter/pagination | 3 |
| 9 | [plan-09-coupons-refunds.md](./plan-09-coupons-refunds.md) | Coupon codes + order refunds | 1 |
| 10 | [plan-10-polish.md](./plan-10-polish.md) | Error pages, loading skeletons, SEO meta | — |

## New Env Vars Required

```
RESEND_API_KEY
RESEND_FROM_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## New DB Migrations Required

- `users` table: add `is_banned boolean default false`
- new `coupons` table

Run after schema changes: `bun run db:generate && bun run db:migrate`
