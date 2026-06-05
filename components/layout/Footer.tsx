import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-cormorant font-semibold text-2xl text-cream block">Lynux</span>
              <span className="font-dm text-[10px] text-cream/50 tracking-[0.2em] uppercase">Espadrilles</span>
            </div>
            <p className="font-dm text-sm text-cream/70 leading-relaxed mb-6">
              Luxury handmade espadrilles crafted in South Africa with French and Spanish inspiration. Comfort in every way.
            </p>
            <a
              href="https://instagram.com/lynux_espadrille"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream/70 hover:text-cream transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              <span className="font-dm text-sm">@lynux_espadrille</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cormorant text-lg font-semibold text-cream mb-6 tracking-wide">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'About', href: '/about' },
                { label: 'Returns', href: '/returns' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-dm text-sm text-cream/70 hover:text-cream transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cormorant text-lg font-semibold text-cream mb-6 tracking-wide">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@lynuxespadrilles.co.za" className="font-dm text-sm text-cream/70 hover:text-cream transition-colors duration-200">
                info@lynuxespadrilles.co.za
              </a>
              <a href="https://instagram.com/lynux_espadrille" target="_blank" rel="noopener noreferrer" className="font-dm text-sm text-cream/70 hover:text-cream transition-colors duration-200">
                @lynux_espadrille
              </a>
              <p className="font-dm text-sm text-cream/70">R65 flat rate delivery</p>
              <p className="font-dm text-sm text-cream/70">South Africa</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8">
          <p className="font-dm text-xs text-cream/40 text-center">
            © 2023–2026 Lynux Espadrilles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
