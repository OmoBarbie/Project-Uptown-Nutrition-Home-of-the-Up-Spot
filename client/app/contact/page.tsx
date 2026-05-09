import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Contact & Location',
  description:
    'Visit Uptown Nutrition at 4548 N Broadway, Chicago IL 60640. Call 312-899-6358. Open Mon–Sat 7am–7pm, Sun 8am–5pm.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Uptown Nutrition — Chicago',
    description:
      'Visit us at 4548 N Broadway, Chicago IL. Call 312-899-6358 or follow @UPTOWNNUTRITIONCHI on Instagram and Facebook.',
    url: '/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <section className="border-b border-sand pt-20 pb-12 sm:pt-24">
          <Container>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Find us</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-medium text-charcoal leading-[0.92]">
              Get In Touch
            </h1>
            <p className="mt-4 text-foreground/60 text-lg max-w-lg">
              Visit us, call us, or follow us on social media. We'd love to hear from you!
            </p>
          </Container>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Info */}
              <div>
                <h2 className="font-display text-2xl font-medium text-charcoal mb-6">Visit Our Store</h2>
                <div className="space-y-6">
                  <div className="border-l-2 border-sand pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-1">Address</p>
                    <a
                      href="https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest-600 hover:text-forest-700 transition-colors font-medium"
                    >
                      4548 N Broadway
                      <br />
                      Chicago, IL 60640
                    </a>
                  </div>

                  <div className="border-l-2 border-sand pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-1">Phone</p>
                    <a href="tel:312-899-6358" className="block text-forest-600 hover:text-forest-700 transition-colors font-medium">312-899-6358</a>
                    <a href="tel:630-251-8059" className="block text-forest-600 hover:text-forest-700 transition-colors font-medium mt-0.5">630-251-8059</a>
                  </div>

                  <div className="border-l-2 border-sand pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-2">Hours</p>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <div className="flex justify-between gap-8">
                        <span>Monday – Saturday</span>
                        <span className="text-charcoal font-medium">7am – 7pm</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="text-charcoal font-medium">8am – 5pm</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-sand pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-2">Follow Us</p>
                    <div className="flex gap-4">
                      <a href="https://instagram.com/UPTOWNNUTRITIONCHI" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:text-forest-700 transition-colors font-medium text-sm">Instagram</a>
                      <a href="https://facebook.com/UPTOWNNUTRITIONCHI" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:text-forest-700 transition-colors font-medium text-sm">Facebook</a>
                    </div>
                    <p className="mt-1 text-xs text-foreground/50">@UPTOWNNUTRITIONCHI</p>
                    <p className="mt-2 text-sm text-terracotta-500 font-medium">★ Check in &amp; receive $1 off!</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="overflow-hidden border border-sand h-[420px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.3583636399887!2d-87.6599204!3d41.9647329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fd3cd5ae291c9%3A0x8101be963dd71ec!2sThe%20Up%20Spot%20Home%20Of%20Uptown%20Nutrition!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Uptown Nutrition Location"
                />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
