import Link from 'next/link'
import { Container } from '@/components/Container'
import { NewsletterForm } from '@/components/newsletter-form'

function SocialIconInstagram(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
      />
    </svg>
  )
}

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Sale', href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about' },
    { label: 'The Up Spot', href: '/upspot' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Shipping Info', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-forest-950">
      {/* Newsletter section */}
      <div className="border-b border-cream-100/10">
        <Container className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-terracotta-400" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-400">
                  Stay connected
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-medium text-cream-100 leading-[0.92]">
                Join Our
                <br />
                <em>Wellness Community</em>
              </h2>
            </div>

            <NewsletterForm />
          </div>
        </Container>
      </div>

      {/* Main footer */}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cream-100/10 flex items-center justify-center">
                <span className="text-cream-100 text-[10px] font-bold tracking-wider">
                  UP
                </span>
              </div>
              <span className="font-display text-base font-semibold tracking-[0.15em] uppercase text-cream-100">
                Uptown Nutrition
              </span>
            </div>

            <p className="mt-4 text-sm text-cream-100/35 max-w-xs leading-relaxed">
              Making healthy eating accessible to everyone. Fresh, nutritious
              meals and snacks crafted with care for your wellness journey.
            </p>

            <div className="mt-6 space-y-2 text-sm text-cream-100/35">
              <a
                href="https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-cream-100 transition-colors"
              >
                4548 N Broadway, Chicago
              </a>
              <a
                href="tel:312-899-6358"
                className="block hover:text-cream-100 transition-colors"
              >
                312-899-6358
              </a>
              <a
                href="tel:630-251-8059"
                className="block hover:text-cream-100 transition-colors"
              >
                630-251-8059
              </a>
            </div>

            <div className="mt-6 flex gap-4">
              <Link
                href="https://facebook.com/UPTOWNNUTRITIONCHI"
                target="_blank"
                aria-label="Facebook"
                className="text-cream-100/25 hover:text-cream-100 transition-colors"
              >
                <SocialIconFacebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/UPTOWNNUTRITIONCHI"
                target="_blank"
                aria-label="Instagram"
                className="text-cream-100/25 hover:text-cream-100 transition-colors"
              >
                <SocialIconInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-cream-100/60">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-cream-100/30 hover:text-cream-100 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream-100/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-100/25">
            &copy;
            {' '}
            {/* eslint-disable-next-line react/purity */}
            {new Date().getFullYear()}
            {' '}
            Uptown Nutrition. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-cream-100/25">
            <span>Fresh Daily</span>
            <span className="hidden sm:inline">Nutritionist Approved</span>
            <span className="hidden md:inline">Premium Ingredients</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
