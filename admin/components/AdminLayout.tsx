'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBagIcon,
  CubeIcon,
  ChartBarIcon,
  TagIcon,
  UsersIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  TicketIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { ThemeToggle } from './theme-toggle';

const allNavigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Reviews', href: '/reviews', icon: StarIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Coupons', href: '/coupons', icon: TicketIcon },
  { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardDocumentListIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Newsletter', href: '/newsletter', icon: EnvelopeIcon },
];

const bottomPrimary = allNavigation.slice(0, 4);
const bottomOverflow = allNavigation.slice(4);

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: session } = useSession();

  const currentPage = allNavigation.find(n => isActive(pathname, n.href));

  const handleLogout = async () => {
    setMoreOpen(false);
    await signOut();
    router.push('/login');
  };

  if (pathname === '/login') return <>{children}</>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <aside
        className="hidden lg:flex"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: '224px',
          flexDirection: 'column',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Squares2X2Icon style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-bricolage, system-ui)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.1 }}>
                Uptown
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--orange)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            Navigation
          </div>
          {allNavigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.name}
                href={item.href as Route}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.575rem 0.625rem',
                  borderRadius: 0,
                  marginBottom: '0.1rem',
                  fontSize: '0.875rem', fontWeight: active ? 600 : 500,
                  color: active ? 'var(--orange)' : 'var(--text-secondary)',
                  background: active ? 'var(--orange-dim)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.12s',
                  borderLeft: active ? '2px solid var(--orange)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--card)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; } }}
              >
                <item.icon style={{ width: 17, height: 17, flexShrink: 0 }} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        {session?.user && (
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: 8, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--orange-dim)',
                border: '1.5px solid var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)',
                flexShrink: 0,
              }}>
                {session.user.email?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.email}
                </div>
              </div>
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                width: '100%', padding: '0.5rem 0.625rem',
                background: 'none', border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 500,
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-dim, #fee2e2)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <ArrowRightOnRectangleIcon style={{ width: 15, height: 15 }} />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* ── MOBILE TOP HEADER ───────────────────────────────── */}
      <header
        className="lg:hidden"
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Squares2X2Icon style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-bricolage, system-ui)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text)' }}>
            {currentPage?.name ?? 'Admin'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ThemeToggle />
          {session?.user && (
            <>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--orange-dim)',
                border: '1.5px solid var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--orange)',
              }}>
                {session.user.email?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <ArrowRightOnRectangleIcon style={{ width: 18, height: 18 }} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="lg:pl-[224px]">
        <div
          style={{ maxWidth: 1280, margin: '0 auto' }}
          className="px-4 pt-6 pb-40 sm:px-6 lg:px-8 lg:py-8 lg:pb-10"
        >
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────── */}
      <nav
        className="grid lg:hidden pb-safe"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          gridTemplateColumns: 'repeat(5, 1fr)',
          paddingTop: '0.5rem',
        }}
      >
        {bottomPrimary.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.name}
              href={item.href as Route}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                padding: '0.25rem 0',
                color: active ? 'var(--orange)' : 'var(--text-muted)',
                textDecoration: 'none',
                minHeight: 48,
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <item.icon style={{ width: 21, height: 21 }} />
              <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.03em' }}>{item.name}</span>
              {active && (
                <span style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 2, borderRadius: 1,
                  background: 'var(--orange)',
                }} />
              )}
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
            padding: '0.25rem 0', background: 'none', border: 'none', cursor: 'pointer',
            color: moreOpen ? 'var(--orange)' : 'var(--text-muted)',
            minHeight: 48,
            justifyContent: 'center',
          }}
        >
          <EllipsisHorizontalIcon style={{ width: 21, height: 21 }} />
          <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.03em' }}>More</span>
        </button>
      </nav>

      {/* ── MORE SHEET ──────────────────────────────────────── */}
      {moreOpen && (
        <>
          <div onClick={() => setMoreOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60 }} />
          <div
            className="lg:hidden"
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70,
              background: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              borderRadius: '16px 16px 0 0',
              padding: '0 0 1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.75rem 0 0.5rem' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>More</span>
              <button onClick={() => setMoreOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                <XMarkIcon style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ padding: '0 0.75rem' }}>
              {bottomOverflow.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href as Route}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem',
                      borderRadius: 0,
                      marginBottom: '0.2rem',
                      color: active ? 'var(--orange)' : 'var(--text)',
                      background: active ? 'var(--orange-dim)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '0.9rem', fontWeight: 500,
                    }}
                  >
                    <item.icon style={{ width: 20, height: 20, color: active ? 'var(--orange)' : 'var(--text-secondary)' }} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div style={{ padding: '0.75rem 0.75rem 0', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%',
                  padding: '0.75rem', borderRadius: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 500,
                }}
              >
                <ArrowRightOnRectangleIcon style={{ width: 20, height: 20 }} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
