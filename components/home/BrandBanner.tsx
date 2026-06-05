import Link from 'next/link'

export default function BrandBanner() {
  return (
    <section className="py-24 lg:py-32 bg-clay">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <blockquote className="font-cormorant italic font-light text-5xl lg:text-7xl text-cream leading-tight mb-8">
          &ldquo;Comfort in every way&rdquo;
        </blockquote>
        <p className="font-dm text-base lg:text-lg text-cream/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          Every pair of Lynux Espadrilles is handcrafted to order. Made with premium materials, inspired by the Mediterranean.
        </p>
        <Link
          href="/shop"
          className="inline-block font-dm text-sm font-medium bg-ink hover:bg-ink-mid text-cream px-10 py-4 transition-all duration-300 tracking-widest uppercase"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
