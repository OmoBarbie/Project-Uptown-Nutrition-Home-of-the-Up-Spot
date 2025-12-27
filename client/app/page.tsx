// Main landing page assembling all components
// This demonstrates the full ecommerce landing page composition

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Products } from '@/components/Products'
import { Features } from '@/components/Features'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
