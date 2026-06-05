export const metadata = {
  title: 'About — Lynux Espadrilles',
  description: 'Learn about Lynux Espadrilles, a South African luxury handmade espadrille brand.',
}

export default function AboutPage() {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-4">Our Story</p>
        <h1 className="font-cormorant font-semibold text-5xl lg:text-6xl text-ink mb-10 leading-tight">
          Crafted with<br />
          <span className="italic text-clay-dark">heart and sole</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-ink mb-4">Who We Are</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed">
              Founded in 2020, Lynux Espadrilles is a South African luxury footwear brand dedicated to the art of handcrafted espadrilles. Each pair is made to order, reflecting our commitment to quality and individuality.
            </p>
          </div>
          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-ink mb-4">Our Inspiration</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed">
              Inspired by the timeless elegance of French and Spanish shoe-making traditions, we bring Mediterranean craftsmanship to South Africa. Our designs blend classic espadrille style with modern comfort.
            </p>
          </div>
        </div>

        <div className="bg-sand p-10 text-center">
          <blockquote className="font-cormorant italic text-3xl lg:text-4xl text-ink mb-4">
            &ldquo;Luxury, comfort, customisable&rdquo;
          </blockquote>
          <p className="font-dm text-sm text-ink-light">— The Lynux Promise</p>
        </div>
      </div>
    </div>
  )
}
