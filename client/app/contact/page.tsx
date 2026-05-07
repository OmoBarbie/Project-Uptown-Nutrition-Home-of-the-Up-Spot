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
      <main className="py-20 bg-white dark:bg-slate-950">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Get In Touch
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Visit us, call us, or follow us on social media. We&apos;d love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Visit Our Store</h2>
                  <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Address</h3>
                      <a
                        href="https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z/data=!3m1!4b1!4m6!3m5!1s0x880fd3cd5ae291c9:0x8101be963dd71ec!8m2!3d41.9647329!4d-87.6573455!16s%2Fg%2F11bz0s1834?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                      >
                        4548 N Broadway
                        <br />
                        Chicago, IL
                      </a>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
                      <a href="tel:312-899-6358" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition block">
                        312-899-6358
                      </a>
                      <a href="tel:630-251-8059" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition block">
                        630-251-8059
                      </a>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Follow Us</h3>
                      <div className="flex gap-4 mt-2">
                        <a
                          href="https://instagram.com/UPTOWNNUTRITIONCHI"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                        >
                          Instagram
                        </a>
                        <a
                          href="https://facebook.com/UPTOWNNUTRITIONCHI"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                        >
                          Facebook
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        @UPTOWNNUTRITIONCHI
                      </p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Check in and receive $1 off!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg dark:shadow-slate-900/50 h-[400px] ring-1 ring-slate-200 dark:ring-slate-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.3583636399887!2d-87.6599204!3d41.9647329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fd3cd5ae291c9%3A0x8101be963dd71ec!2sThe%20Up%20Spot%20Home%20Of%20Uptown%20Nutrition!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Uptown Nutrition Location"
                >
                </iframe>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
