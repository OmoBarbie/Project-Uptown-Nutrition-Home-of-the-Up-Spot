import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

function SocialIconInstagram(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900">
      {/* Newsletter CTA Section */}
      <div className="border-b border-slate-800">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join Our Wellness Community
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Get exclusive access to new menu items, nutrition tips, healthy recipes, and
              special offers.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 max-w-md rounded-full border-0 bg-white/10 px-6 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Button type="submit" color="emerald">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-slate-400">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">UP</span>
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-teal-500">u</span>
                <span className="text-pink-500">p</span>
                <span className="text-lime-500">t</span>
                <span className="text-orange-500">o</span>
                <span className="text-teal-500">w</span>
                <span className="text-pink-500">n</span>
                <span className="text-slate-300"> nutrition</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              Making healthy eating accessible to everyone. Fresh, nutritious meals
              and snacks crafted with care for your wellness journey.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <p className="font-semibold text-slate-300">Visit Us</p>
              <a
                href="https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z/data=!3m1!4b1!4m6!3m5!1s0x880fd3cd5ae291c9:0x8101be963dd71ec!8m2!3d41.9647329!4d-87.6573455!16s%2Fg%2F11bz0s1834?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-emerald-400 transition"
              >
                4548 N Broadway, Chicago
              </a>
              <div className="space-y-1">
                <p className="font-semibold text-slate-300">Call Us</p>
                <a href="tel:312-899-6358" className="block hover:text-emerald-400 transition">312-899-6358</a>
                <a href="tel:630-251-8059" className="block hover:text-emerald-400 transition">630-251-8059</a>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Link
                href="https://facebook.com/UPTOWNNUTRITIONCHI"
                target="_blank"
                aria-label="Facebook"
                className="text-slate-400 hover:text-white transition"
              >
                <SocialIconFacebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://instagram.com/UPTOWNNUTRITIONCHI"
                target="_blank"
                aria-label="Instagram"
                className="text-slate-400 hover:text-white transition"
              >
                <SocialIconInstagram className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-teal-500">u</span>
              <span className="text-pink-500">p</span>
              <span className="text-lime-500">t</span>
              <span className="text-orange-500">o</span>
              <span className="text-teal-500">w</span>
              <span className="text-pink-500">n</span>
              <span> nutrition</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>🥗 Fresh Daily</span>
              <span className="hidden sm:inline">💪 Nutritionist Approved</span>
              <span className="hidden md:inline">✓ Premium Ingredients</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
